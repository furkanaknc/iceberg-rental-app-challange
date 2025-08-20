import { PrismaClient } from '@prisma/client';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

const prisma = new PrismaClient();
const httpService = new HttpService();

interface PostcodeResult {
  postcode: string;
  latitude: number;
  longitude: number;
  parish: string;
}

async function lookupPostcode(postcode: string) {
  try {
    const response = await firstValueFrom(
      httpService.get(`https://api.postcodes.io/postcodes/${postcode.replace(/\s+/g, '').toUpperCase()}`),
    );

    const data = response.data;
    const result = data.result as PostcodeResult;

    return {
      postcode: result.postcode,
      latitude: result.latitude,
      longitude: result.longitude,
      parish: result.parish,
    };
  } catch (error) {
    console.error(`Error looking up postcode ${postcode}:`, error);
    throw error;
  }
}

async function createMainOffice() {
  try {
    console.log('🏢 Checking for main office...');

    const MAIN_OFFICE_POSTCODE = 'CM2 7PJ';
    const MAIN_OFFICE_NAME = 'Main Office';

    const existingOffice = await prisma.office.findFirst({
      where: {
        OR: [{ postcode: MAIN_OFFICE_POSTCODE }, { name: MAIN_OFFICE_NAME }],
      },
    });

    if (existingOffice) {
      console.log('✅ Main office already exists:', {
        id: existingOffice.id,
        name: existingOffice.name,
        postcode: existingOffice.postcode,
        latitude: existingOffice.latitude?.toString(),
        longitude: existingOffice.longitude?.toString(),
      });
      return existingOffice;
    }

    console.log(`📍 Looking up postcode: ${MAIN_OFFICE_POSTCODE}`);
    const postcodeInfo = await lookupPostcode(MAIN_OFFICE_POSTCODE);

    const mainOffice = await prisma.office.create({
      data: {
        name: MAIN_OFFICE_NAME,
        postcode: postcodeInfo.postcode,
        latitude: postcodeInfo.latitude,
        longitude: postcodeInfo.longitude,
      },
    });

    console.log('🎉 Main office created successfully:', {
      id: mainOffice.id,
      name: mainOffice.name,
      postcode: mainOffice.postcode,
      latitude: mainOffice.latitude?.toString(),
      longitude: mainOffice.longitude?.toString(),
      created_at: mainOffice.created_at.toISOString(),
    });

    return mainOffice;
  } catch (error) {
    console.error('❌ Error creating main office:', error);
    throw error;
  }
}

export { createMainOffice };

if (require.main === module) {
  createMainOffice()
    .catch((error) => {
      console.error('Failed to create main office:', error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
