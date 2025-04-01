import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { wktToGeoJSON } from '@terraformer/wkt';

const prisma = new PrismaClient();

export const getTenant = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cognitoId } = req.params;

    const tenant = await prisma.tenant.findUnique({
      where: {
        cognitoId,
      },
      include: {
        favorites: true,
      },
    });

    if (tenant) res.json(tenant);
    else res.status(404).json({ message: 'Tenant not found' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message: `Error retrieving tenant: ${message}` });
  }
};

export const createTenant = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { cognitoId, name, email, phoneNumber } = req.body;
    // TODO: Add validation for the input fields

    const tenant = await prisma.tenant.create({
      data: {
        cognitoId,
        name,
        email,
        phoneNumber,
      },
    });

    res.status(201).json(tenant);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message: `Error creating tenant: ${message}` });
  }
};

export const updateTenant = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { cognitoId } = req.params;
    const { name, email, phoneNumber } = req.body;

    const tenant = await prisma.tenant.update({
      where: {
        cognitoId,
      },
      data: {
        name,
        email,
        phoneNumber,
      },
    });

    if (tenant) {
      res.json(tenant);
    } else {
      res.status(404).json({ message: 'Tenant not found' });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message: `Error updating tenant: ${message}` });
  }
};

export const getCurrentResidences = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { cognitoId } = req.params;

    if (!cognitoId) {
      res.status(400).json({ message: 'Property cognitoId is required' });
      return;
    }

    const properties = await prisma.property.findMany({
      where: {
        tenants: {
          some: {
            cognitoId,
          },
        },
      },
      include: {
        location: true,
      },
    });

    const residencesWithFormattedLocation = await Promise.all(
      properties.map(async (property) => {
        const coordinates: { coordinates: string }[] =
          await prisma.$queryRaw`SELECT ST_asText(coordinates) AS coordinates FROM "Location" WHERE id = ${property.location.id}`;

        const geoJSON = wktToGeoJSON(coordinates[0].coordinates) as {
          type: string;
          coordinates: [number, number];
        };
        const longitude = geoJSON.coordinates[0];
        const latitude = geoJSON.coordinates[1];

        return {
          ...property,
          location: {
            ...property.location,
            coordinates: {
              longitude,
              latitude,
            },
          },
        };
      })
    );

    res.status(200).json(residencesWithFormattedLocation);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res
      .status(500)
      .json({ message: `Error retrieving properties: ${message}` });
  }
};

export const addFavoriteProperty = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { cognitoId, propertyId } = req.params;

    if (!cognitoId || !propertyId) {
      res
        .status(400)
        .json({ message: 'Cognito ID and Property ID are required' });
      return;
    }

    const tenant = await prisma.tenant.findUnique({
      where: { cognitoId },
      include: { favorites: true },
    });

    const propertyIdNumber = Number(propertyId);
    const existingFavorites = tenant?.favorites || [];

    if (
      !existingFavorites.some((favorite) => favorite.id === propertyIdNumber)
    ) {
      const updatedTenant = await prisma.tenant.update({
        where: { cognitoId },
        data: {
          favorites: {
            connect: {
              id: propertyIdNumber,
            },
          },
        },
        include: {
          favorites: true,
        },
      });

      res.status(200).json(updatedTenant);
    } else {
      res.status(409).json({ message: 'Property already in favorites' });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res
      .status(500)
      .json({ message: `Error adding favorite property: ${message}` });
  }
};
