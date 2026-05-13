import { prisma } from '../core/database.js';
import { NotFoundError } from '../core/errors.js';

export class MarketplaceService {
  static async listItems(query: { type?: string, search?: string }) {
    return prisma.marketplaceItem.findMany({
      where: {
        ...(query.type && { type: query.type }),
        ...(query.search && {
          OR: [
            { name: { contains: query.search, mode: 'insensitive' } },
            { description: { contains: query.search, mode: 'insensitive' } }
          ]
        })
      },
      include: {
        creator: { select: { name: true, rating: true } }
      },
      orderBy: { installCount: 'desc' }
    });
  }

  static async getItem(id: string) {
    const item = await prisma.marketplaceItem.findUnique({
      where: { id },
      include: {
        creator: true,
        reviews: {
          include: { user: { select: { name: true, avatar: true } } },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!item) throw new NotFoundError('Marketplace item not found');
    return item;
  }

  static async installPlugin(projectId: string, itemId: string) {
    const item = await prisma.marketplaceItem.findFirst({
      where: { id: itemId, type: 'plugin' }
    });

    if (!item) throw new NotFoundError('Plugin not found');

    const install = await prisma.pluginInstall.create({
      data: {
        projectId,
        itemId,
        status: 'active'
      }
    });

    // Increment install count
    await prisma.marketplaceItem.update({
      where: { id: itemId },
      data: { installCount: { increment: 1 } }
    });

    return install;
  }

  static async getInstalledPlugins(projectId: string) {
    return prisma.pluginInstall.findMany({
      where: { projectId, status: 'active' },
      include: {
        item: {
          include: { creator: { select: { name: true } } }
        }
      }
    });
  }
}
