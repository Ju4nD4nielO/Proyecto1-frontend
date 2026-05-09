const API_URL = 'https://games-tracker-api-sd8l.onrender.com';

const api = {
  async getAll() {
    const res = await fetch(`${API_URL}/games`);
    if (!res.ok) throw new Error('Failed to fetch games');
    return res.json();
  },

  async getOne(id) {
    const res = await fetch(`${API_URL}/games/${id}`);
    if (!res.ok) throw new Error('Game not found');
    return res.json();
  },

  async create(data) {
    const res = await fetch(`${API_URL}/games`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to create game');
    }
    return res.json();
  },

  async update(id, data) {
    const res = await fetch(`${API_URL}/games/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to update game');
    }
    return res.json();
  },

  async remove(id) {
    const res = await fetch(`${API_URL}/games/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete game');
  }
};