import * as readline from 'readline';
import { PrismaClient, Role, UserStatus } from '@prisma/client';
import { hashSync } from 'bcrypt';

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password: string): boolean {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)(?!.*\s).{8,}$/;
  return passwordRegex.test(password);
}

function validateName(name: string): boolean {
  return name.trim().length >= 3;
}

async function createAdmin() {
  console.log('🔧 Admin Creation Seeder');
  console.log('========================\n');

  try {
    const existingAdmin = await prisma.user.findFirst({
      where: { role: Role.ADMIN },
    });

    if (existingAdmin) {
      console.log('⚠️  An admin user already exists:');
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Name: ${existingAdmin.first_name} ${existingAdmin.last_name}\n`);

      const overwrite = await question('Do you want to create another admin? (y/N): ');
      if (overwrite.toLowerCase() !== 'y' && overwrite.toLowerCase() !== 'yes') {
        console.log('❌ Admin creation cancelled.');
        return;
      }
      console.log();
    }

    let email: string;
    do {
      email = await question('📧 Enter admin email: ');
      if (!validateEmail(email)) {
        console.log('❌ Invalid email format. Please try again.\n');
      } else {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
          console.log('❌ Email already exists. Please use a different email.\n');
          email = '';
        }
      }
    } while (!validateEmail(email) || email === '');

    let firstName: string;
    do {
      firstName = await question('👤 Enter first name (min 3 characters): ');
      if (!validateName(firstName)) {
        console.log('❌ First name must be at least 3 characters long.\n');
      }
    } while (!validateName(firstName));

    let lastName: string;
    do {
      lastName = await question('👤 Enter last name (min 3 characters): ');
      if (!validateName(lastName)) {
        console.log('❌ Last name must be at least 3 characters long.\n');
      }
    } while (!validateName(lastName));

    let password: string;
    do {
      password = await question(
        '🔒 Enter password (min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char): ',
      );
      if (!validatePassword(password)) {
        console.log(
          '❌ Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.\n',
        );
      }
    } while (!validatePassword(password));

    const phone = await question('📱 Enter phone number (optional): ');

    console.log('\n📋 Admin Details:');
    console.log(`   Email: ${email}`);
    console.log(`   Name: ${firstName} ${lastName}`);
    console.log(`   Phone: ${phone || 'Not provided'}`);

    const confirm = await question('\n✅ Create admin with these details? (Y/n): ');
    if (confirm.toLowerCase() === 'n' || confirm.toLowerCase() === 'no') {
      console.log('❌ Admin creation cancelled.');
      return;
    }

    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS);
    const hashedPassword = hashSync(password, saltRounds);

    const admin = await prisma.user.create({
      data: {
        email,
        first_name: firstName,
        last_name: lastName,
        phone: phone,
        password: hashedPassword,
        role: Role.ADMIN,
        status: UserStatus.ACTIVE,
      },
    });

    console.log('\n🎉 Admin user created successfully!');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Name: ${admin.first_name} ${admin.last_name}`);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

process.on('SIGINT', async () => {
  console.log('\n\n👋 Goodbye!');
  rl.close();
  await prisma.$disconnect();
  process.exit(0);
});

createAdmin();
