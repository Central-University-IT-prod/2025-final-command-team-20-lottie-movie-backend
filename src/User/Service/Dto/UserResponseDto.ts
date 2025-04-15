import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';

export class UserResponseDto {
  @ApiProperty({ type: Number })
  public id: string;

  @ApiProperty({ type: String })
  public firstName: string;

  @ApiProperty({ type: String, nullable: true })
  public lastName: string | null;

  @ApiProperty({ type: String, nullable: true })
  public username: string | null;

  static fromModel(user: User): UserResponseDto {
    return new UserResponseDto({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
    });
  }

  constructor(props: UserResponseDto) {
    this.id = props.id;
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.username = props.username;
  }
}
