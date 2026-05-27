import { AuthenticatedUser, UserType } from '@Common';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { AddMemberDto, UpdateMemberDto } from './dto';

@Injectable()
export class MemberService {
  constructor(private readonly prisma: PrismaService) {}

  async addMember(ctx: AuthenticatedUser, dto: AddMemberDto) {
    if (ctx.type !== UserType.USER) {
      throw new Error('only librarain can add member');
    }

    const member = await this.prisma.member.findUnique({
      where: {
        email: dto.email,
        mobile: dto.mobile,
      },
    });

    if (member) {
      throw new Error(
        `this email ${dto.email} and mobile ${dto.mobile} is already add`,
      );
    }

    const addMember = await this.prisma.member.create({
      data: {
        firstname: dto.firstname,
        lastname: dto.lastname,
        email: dto.email,
        mobile: dto.mobile,
        address: dto.address,
        userId: ctx.id,
      },
    });

    if (!addMember) {
      throw new Error('somthing went wrong when add member');
    }

    return {
      message: 'memeber add succesfully ',
      addMember,
    };
  }

  async findAllMember(librarinId: AuthenticatedUser) {
    const librarin = await this.prisma.user.findUnique({
      where: {
        id: librarinId.id,
      },
    });

    if (!librarin) {
      throw new Error(' only librarian can find all member list ');
    }
    const allMember = await this.prisma.member.findMany({
      orderBy: {
        createdAt: 'asc',
      },
      include: {
        user: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
          },
        },
      },
    });

    if (!allMember) {
      throw new Error('member is not avalible  ');
    }

    return {
      message: ' feacth all member',
      allMember,
    };
  }

  async findById(librarinId: AuthenticatedUser, memberId: number) {
    const librarin = await this.prisma.user.findUnique({
      where: {
        id: librarinId.id,
      },
    });
    if (!librarin) {
      throw new Error('anly librarin can find all member ');
    }
    const findMember = await this.prisma.member.findUnique({
      where: {
        id: memberId,
      },
    });

    if (!findMember) {
      throw new Error('somthing went wrong when find a single  member');
    }

    return {
      message: 'find member by id successfully',
      findMember,
    };
  }

  async deleteMember(librarinId: AuthenticatedUser, memberId: number) {
    const librarin = await this.prisma.user.findUnique({
      where: {
        id: librarinId.id,
      },
    });
    if (!librarin) {
      throw new Error('anly librarin can do this  ');
    }

    const deleteMember = await this.prisma.member.delete({
      where: { id: memberId },
    });

    if (!deleteMember) {
      throw new Error('member not found ');
    }

    return {
      message: 'member delete successFully',
    };
  }

  async udateMember(
    librarinId: AuthenticatedUser,
    memberId: number,
    dto: UpdateMemberDto,
  ) {
    const librarin = await this.prisma.user.findUnique({
      where: {
        id: librarinId.id,
      },
    });
    if (!librarin) {
      throw new Error('anly librarin can do this  ');
    }

    const update = await this.prisma.member.update({
      where: { id: memberId },
      data: {
        firstname: dto.firstname,
        lastname: dto.lastname,
        email: dto.email,
        mobile: dto.mobile,
        address: dto.address,
        userId: librarinId.id,
      },
    });

    if (!update) {
      throw new Error('somthing went wrong when update a member ');
    }

    return {
      message: 'Member update successfully ',
      update,
    };
  }
}
