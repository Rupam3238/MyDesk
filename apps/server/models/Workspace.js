import { v4 as uuidv4 } from 'uuid';
import { dbRun, dbGet, dbAll } from '../db/database.js';

export class Workspace {
  // Create new workspace
  static async create(data) {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    await dbRun(
      `INSERT INTO workspaces (id, user_id, name, icon, color, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, data.user_id, data.name, data.icon || null, data.color || 'purple', now]
    );

    // Add workspace items if provided
    if (data.items && data.items.length > 0) {
      for (let i = 0; i < data.items.length; i++) {
        const item = data.items[i];
        await this.addItem(id, item.label, item.icon, item.url, i);
      }
    }
    
    return this.getById(id);
  }

  // Get workspace by ID with items
  static async getById(id) {
    const workspace = await dbGet('SELECT * FROM workspaces WHERE id = ?', [id]);
    if (!workspace) return null;

    // Get workspace items
    const items = await dbAll(
      'SELECT * FROM workspace_items WHERE workspace_id = ? ORDER BY order_index ASC',
      [id]
    );

    return {
      ...workspace,
      items,
    };
  }

  // Get all workspaces for a user
  static async getAllByUser(user_id) {
    const workspaces = await dbAll(
      'SELECT * FROM workspaces WHERE user_id = ? ORDER BY created_at DESC',
      [user_id]
    );

    // Attach items to each workspace
    for (let workspace of workspaces) {
      const items = await dbAll(
        'SELECT * FROM workspace_items WHERE workspace_id = ? ORDER BY order_index ASC',
        [workspace.id]
      );
      workspace.items = items;
    }

    return workspaces;
  }

  // Update workspace
  static async update(id, data) {
    const updates = [];
    const values = [];

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && !['id', 'user_id', 'created_at', 'items'].includes(key)) {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (updates.length > 0) {
      values.push(id);
      await dbRun(
        `UPDATE workspaces SET ${updates.join(', ')} WHERE id = ?`,
        values
      );
    }

    return this.getById(id);
  }

  // Delete workspace
  static async delete(id) {
    // Delete items
    await dbRun('DELETE FROM workspace_items WHERE workspace_id = ?', [id]);
    // Delete workspace
    await dbRun('DELETE FROM workspaces WHERE id = ?', [id]);
  }

  // =====================================================
  // WORKSPACE ITEMS MANAGEMENT
  // =====================================================

  // Add item to workspace
  static async addItem(workspace_id, label, icon = null, url = null, order_index = null) {
    const id = uuidv4();
    const now = new Date().toISOString();

    // Get max order_index if not provided
    if (order_index === null || order_index === undefined) {
      const maxOrder = await dbGet(
        'SELECT MAX(order_index) as max_order FROM workspace_items WHERE workspace_id = ?',
        [workspace_id]
      );
      order_index = (maxOrder.max_order || -1) + 1;
    }

    await dbRun(
      `INSERT INTO workspace_items (id, workspace_id, label, icon, url, order_index, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, workspace_id, label, icon, url, order_index, now]
    );

    return dbGet('SELECT * FROM workspace_items WHERE id = ?', [id]);
  }

  // Update workspace item
  static async updateItem(item_id, data) {
    const updates = [];
    const values = [];

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && !['id', 'workspace_id', 'created_at'].includes(key)) {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (updates.length === 0) return dbGet('SELECT * FROM workspace_items WHERE id = ?', [item_id]);

    values.push(item_id);

    await dbRun(
      `UPDATE workspace_items SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    return dbGet('SELECT * FROM workspace_items WHERE id = ?', [item_id]);
  }

  // Delete workspace item
  static async deleteItem(item_id) {
    await dbRun('DELETE FROM workspace_items WHERE id = ?', [item_id]);
  }

  // Reorder items in workspace
  static async reorderItems(workspace_id, itemIds) {
    for (let i = 0; i < itemIds.length; i++) {
      await dbRun(
        'UPDATE workspace_items SET order_index = ? WHERE id = ?',
        [i, itemIds[i]]
      );
    }
  }

  // Get items for a workspace
  static async getItems(workspace_id) {
    return dbAll(
      'SELECT * FROM workspace_items WHERE workspace_id = ? ORDER BY order_index ASC',
      [workspace_id]
    );
  }
}
