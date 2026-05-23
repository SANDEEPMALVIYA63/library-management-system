import { AddBookDto } from '../dto';
import { Prisma } from 'src/generated/prisma/client';
export async function findBookConflict(
  tx: Prisma.TransactionClient,
  dto: AddBookDto,
) {
  return tx.book.findFirst({
    where: {
      title: dto.title,
      author: dto.author,
    },
    select: {
      id: true,
      title: true,
      author: true,
      status: true,
    },
  });
}
