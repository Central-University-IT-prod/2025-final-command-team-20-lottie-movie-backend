import { User } from '@prisma/client';

export class UserDto {
  id: string;
  firstName: string;
  lastName: string | null;
  username: string | null;

  constructor(id: string, firstName: string, lastName: string | null, username: string | null) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.username = username;
  }

  public static fromModel(model: User): UserDto {
    return new UserDto(model.id, model.firstName, model.lastName, model.username);
  }
}
