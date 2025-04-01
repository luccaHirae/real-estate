import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function calculateNextPaymentDate(startDate: Date): Date {
  const today = new Date();
  const nextPaymentDate = new Date(startDate);

  while (nextPaymentDate <= today) {
    nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
  }

  return nextPaymentDate;
}

export const listApplications = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, userType } = req.query;

    let whereClause = {};

    if (userId && userType) {
      if (userType === 'tenant') {
        whereClause = {
          tenantCognitoId: String(userId),
        };
      } else if (userType === 'manager') {
        whereClause = {
          managerCognitoId: String(userId),
        };
      }
    }

    const applications = await prisma.application.findMany({
      where: whereClause,
      include: {
        property: {
          include: {
            location: true,
            manager: true,
          },
        },
        tenant: true,
      },
    });

    const formattedApplications = await Promise.all(
      applications.map(async (application) => {
        const lease = await prisma.lease.findFirst({
          where: {
            tenant: {
              cognitoId: application.tenantCognitoId,
            },
            propertyId: application.propertyId,
          },
          orderBy: {
            startDate: 'desc',
          },
        });

        return {
          ...application,
          property: {
            ...application.property,
            address: application.property.location.address,
          },
          manager: application.property.manager,
          lease: lease
            ? {
                ...lease,
                nextPaymentDate: calculateNextPaymentDate(lease.startDate),
              }
            : null,
        };
      })
    );

    res.status(200).json(formattedApplications);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res
      .status(500)
      .json({ message: `Error retrieving applications: ${message}` });
  }
};

export const createApplication = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      applicationDate,
      status,
      propertyId,
      tenantCognitoId,
      name,
      email,
      phoneNumber,
      message,
    } = req.body;

    const property = await prisma.property.findUnique({
      where: {
        id: propertyId,
      },
      select: {
        pricePerMonth: true,
        securityDeposit: true,
      },
    });

    if (!property) {
      res.status(404).json({ message: 'Property not found' });
      return;
    }

    const newApplication = await prisma.$transaction(async (prisma) => {
      // Create the lease
      const lease = await prisma.lease.create({
        data: {
          startDate: new Date(),
          endDate: new Date(
            new Date().setFullYear(new Date().getFullYear() + 1)
          ),
          rent: property.pricePerMonth,
          deposit: property.securityDeposit,
          property: {
            connect: {
              id: propertyId,
            },
          },
          tenant: {
            connect: {
              cognitoId: tenantCognitoId,
            },
          },
        },
      });

      // Create the application
      const application = await prisma.application.create({
        data: {
          applicationDate: new Date(applicationDate),
          status,
          name,
          email,
          phoneNumber,
          message,
          property: {
            connect: {
              id: propertyId,
            },
          },
          tenant: {
            connect: {
              cognitoId: tenantCognitoId,
            },
          },
          lease: {
            connect: {
              id: lease.id,
            },
          },
        },
        include: {
          property: true,
          tenant: true,
        },
      });

      return application;
    });

    res.status(201).json(newApplication);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message: `Error creating application: ${message}` });
  }
};

export const updateApplicationStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id) {
      res.status(400).json({ message: 'Application ID is required' });
      return;
    }

    const application = await prisma.application.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        property: true,
        tenant: true,
      },
    });

    if (!application) {
      res.status(404).json({ message: 'Application not found' });
      return;
    }

    if (status === 'Approved') {
      const newLease = await prisma.lease.create({
        data: {
          startDate: new Date(),
          endDate: new Date(
            new Date().setFullYear(new Date().getFullYear() + 1)
          ),
          rent: application.property.pricePerMonth,
          deposit: application.property.securityDeposit,
          propertyId: application.propertyId,
          tenantCognitoId: application.tenantCognitoId,
        },
      });

      await prisma.property.update({
        where: {
          id: application.propertyId,
        },
        data: {
          tenants: {
            connect: {
              cognitoId: application.tenantCognitoId,
            },
          },
        },
      });
    } else {
      await prisma.application.update({
        where: {
          id: Number(id),
        },
        data: {
          status,
        },
      });
    }

    const updatedApplication = await prisma.application.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        property: true,
        tenant: true,
        lease: true,
      },
    });

    res.status(200).json(updatedApplication);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message: `Error updating application: ${message}` });
  }
};
