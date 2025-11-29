// Serviço de API para integração com o backend VOXPAY

const API_BASE_URL = 'http://localhost:3000/api/v1';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('voxpay_token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('voxpay_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('voxpay_token');
  }

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    };

    const config = {
      ...options,
      headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Erro na requisição');
    }

    return data;
  }

  // Auth
  async register(name, email, password) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    this.setToken(data.token);
    return data;
  }

  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(data.token);
    return data;
  }

  logout() {
    this.clearToken();
  }

  // Users
  async getProfile() {
    return this.request('/users/profile');
  }

  async updateProfile(name, avatar) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify({ name, avatar }),
    });
  }

  async getBalance() {
    return this.request('/users/balance');
  }

  // Transactions
  async getTransactions(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/transactions${queryString ? `?${queryString}` : ''}`);
  }

  async createTransaction(transaction) {
    return this.request('/transactions', {
      method: 'POST',
      body: JSON.stringify(transaction),
    });
  }

  async getTransactionStats(period = 'month') {
    return this.request(`/transactions/stats?period=${period}`);
  }

  // Goals
  async getGoals() {
    return this.request('/goals');
  }

  async createGoal(goal) {
    return this.request('/goals', {
      method: 'POST',
      body: JSON.stringify(goal),
    });
  }

  async updateGoalProgress(goalId, amount) {
    return this.request(`/goals/${goalId}/progress`, {
      method: 'PUT',
      body: JSON.stringify({ amount }),
    });
  }

  async deleteGoal(goalId) {
    return this.request(`/goals/${goalId}`, {
      method: 'DELETE',
    });
  }

  // PIX
  async sendPix(recipient, amount, message) {
    return this.request('/pix/send', {
      method: 'POST',
      body: JSON.stringify({ recipient, amount, message }),
    });
  }

  async receivePix(sender, amount) {
    return this.request('/pix/receive', {
      method: 'POST',
      body: JSON.stringify({ sender, amount }),
    });
  }

  // Payments
  async processPayment(payment) {
    return this.request('/payments/process', {
      method: 'POST',
      body: JSON.stringify(payment),
    });
  }

  // Crypto
  async getCryptos() {
    return this.request('/crypto');
  }

  // Notifications
  async getNotifications() {
    return this.request('/notifications');
  }

  async markNotificationAsRead(notificationId) {
    return this.request(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  }

  // Cards
  async getCards() {
    return this.request('/cards');
  }

  // Investments
  async getInvestments() {
    return this.request('/investments');
  }
}

// Exporta instância única
export const api = new ApiService();

// Exemplo de uso:
/*
// Login
await api.login('erick@email.com', 'senha123');

// Criar transação
await api.createTransaction({
  title: 'Salário',
  amount: 5000,
  type: 'income',
  category: 'salary',
});

// Enviar PIX
await api.sendPix('joao@email.com', 100, 'Pagamento');

// Processar pagamento
await api.processPayment({
  description: 'Conta de Luz',
  amount: 150,
  barcode: '123456789...',
  dueDate: '2025-11-30',
});
*/
