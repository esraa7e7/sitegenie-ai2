import { prisma } from '../core/database.js';

export class AdminService {
  static async getSystemConfig() {
    let config = await prisma.systemConfig.findUnique({ where: { id: 'global' } });
    if (!config) {
      config = await prisma.systemConfig.create({
        data: {
          id: 'global',
          aiEnabled: true,
          sandboxEnabled: true,
          deployEnabled: true,
          registrationOpen: true,
          maintenanceMode: false
        }
      });
    }
    return config;
  }

  static async updateConfig(updates: Partial<any>) {
    return prisma.systemConfig.update({
      where: { id: 'global' },
      data: updates
    });
  }

  static async isAIEnabled() {
    const config = await this.getSystemConfig();
    return config.aiEnabled && !config.maintenanceMode;
  }
}
