import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { wktToGeoJSON } from '@terraformer/wkt';

const prisma = new PrismaClient();

export const getManager = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { cognitoId } = req.params;

    const manager = await prisma.manager.findUnique({
      where: {
        cognitoId,
      },
    });

    if (manager) res.json(manager);
    else res.status(404).json({ message: 'Manager not found' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message: `Error retrieving manager: ${message}` });
  }
};

export const createManager = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { cognitoId, name, email, phoneNumber } = req.body;
    // TODO: Add validation for the input fields

    const manager = await prisma.manager.create({
      data: {
        cognitoId,
        name,
        email,
        phoneNumber,
      },
    });

    res.status(201).json(manager);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message: `Error creating manager: ${message}` });
  }
};

export const updateManager = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { cognitoId } = req.params;
    const { name, email, phoneNumber } = req.body;

    const manager = await prisma.manager.update({
      where: {
        cognitoId,
      },
      data: {
        name,
        email,
        phoneNumber,
      },
    });

    res.json(manager);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message: `Error updating manager: ${message}` });
  }
};

export const getManagerProperties = async (
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
        managerCognitoId: cognitoId,
      },
      include: {
        location: true,
      },
    });

    const propertiesWithFormattedLocation = await Promise.all(
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

    res.status(200).json(propertiesWithFormattedLocation);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res
      .status(500)
      .json({ message: `Error retrieving properties: ${message}` });
  }
};
