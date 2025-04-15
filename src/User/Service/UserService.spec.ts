import { PrismaService } from '@/Prisma/PrismaService';
import { UserService } from './UserService';
import { CreateUserDto } from './Dto/CreateUserDto';

describe('UserService', () => {
  let userService: UserService;
  let prisma: PrismaService;

  beforeAll(async () => {
    prisma = new PrismaService();
    await prisma.$connect();

    userService = new UserService(prisma);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should upsert a user', async () => {
    const dto: CreateUserDto = {
      id: 'test-user-id',
      firstName: 'Test',
      lastName: 'User',
      username: 'testuser',
    };

    const user = await userService.upsert(dto);

    expect(userService).toBeDefined();
    expect(userService.upsert(dto)).resolves.toHaveProperty('id', dto.id);
  });

  it('should find a user by id', async () => {
    const user = await userService.find('test-user-id');
    expect(user).not.toBeNull();
    expect(user?.id).toBe('test-user-id');
  });
});
