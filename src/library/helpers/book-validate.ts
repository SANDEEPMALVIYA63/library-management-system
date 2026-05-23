import { ForbiddenException } from '@nestjs/common';
import { AuthenticatedUser, UserType } from '@Common';
export async function assertAdminOrLibrarian(ctx: AuthenticatedUser) {
  if (ctx.type !== UserType.USER) {
    throw new ForbiddenException('Only LIBRARIAN are allowed');
  }
}
