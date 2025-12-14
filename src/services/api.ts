const API_BASE_URL = 'https://site--the7e1--vm5pf569dg4m.code.run/api';

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        let errorMessage = errorData.message || `HTTP error! status: ${response.status}`;

        // Handle structured validation errors (e.g., Django DRF format)
        if (!errorData.message && typeof errorData === 'object' && Object.keys(errorData).length > 0) {
          const details = Object.entries(errorData)
            .map(([key, msgs]) => {
              const msgStr = Array.isArray(msgs) ? msgs.join(', ') : String(msgs);
              return `${key}: ${msgStr}`;
            })
            .join(' | ');
          if (details) errorMessage = details;
        }

        throw new Error(errorMessage);
      }

      return response.status === 204 ? {} as T : await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  // ============== AUTH ENDPOINTS ==============

  async login(email: string, password: string) {
    const response = await this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(response.token);
    return response;
  }

  async register(name: string, email: string, password: string) {
    const response = await this.request<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    this.setToken(response.token);
    return response;
  }

  async getProfile() {
    return this.request<{ user: any }>('/auth/profile');
  }

  async updateProfile(data: any) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // ============== COURSES ENDPOINTS ==============

  async getCourses(params?: any) {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request<{ courses: any[] }>(`/courses${queryString}`);
  }

  async getCourse(id: string) {
    return this.request<{ course: any }>(`/courses/${id}`);
  }

  async enrollInCourse(courseId: string) {
    return this.request(`/courses/${courseId}/enroll`, {
      method: 'POST',
    });
  }

  async completeLesson(courseId: string, lessonId: string) {
    return this.request(`/courses/${courseId}/lessons/${lessonId}/complete`, {
      method: 'POST',
    });
  }

  async addCourse(courseData: FormData) {
    return this.request('/courses', {
      method: 'POST',
      body: courseData,
    });
  }

  async updateCourse(id: string, courseData: FormData) {
    return this.request(`/courses/${id}`, {
      method: 'PUT',
      body: courseData,
    });
  }

  async deleteCourse(id: string) {
    return this.request(`/courses/${id}`, {
      method: 'DELETE',
    });
  }

  // ============== PRODUCTS ENDPOINTS ==============

  async getProducts(params?: any) {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request<{ products: any[] }>(`/products${queryString}`);
  }

  async getProduct(id: string) {
    return this.request<{ product: any }>(`/products/${id}`);
  }

  async addProduct(productData: FormData) {
    return this.request('/products', {
      method: 'POST',
      body: productData,
    });
  }

  async updateProduct(id: string, productData: FormData) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: productData,
    });
  }

  async deleteProduct(id: string) {
    return this.request(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  // ============== CART ENDPOINTS ==============

  async getCart() {
    return this.request<{ items: any[]; total: number }>('/cart');
  }

  async addToCart(itemId: string, itemType: 'course' | 'product', quantity: number = 1) {
    return this.request('/cart/add', {
      method: 'POST',
      body: JSON.stringify({
        item_id: itemId,
        item_type: itemType,
        quantity
      }),
    });
  }

  async removeFromCart(itemId: string, itemType: 'course' | 'product') {
    return this.request('/cart/remove', {
      method: 'DELETE',
      body: JSON.stringify({ item_id: itemId, item_type: itemType }),
    });
  }

  async updateCartItem(itemId: string, itemType: 'course' | 'product', quantity: number) {
    return this.request('/cart/update', {
      method: 'PUT',
      body: JSON.stringify({ item_id: itemId, item_type: itemType, quantity }),
    });
  }

  async clearCart() {
    return this.request('/cart/clear', {
      method: 'DELETE',
    });
  }

  // ============== ORDERS ENDPOINTS ==============

  async createOrder(paymentMethod: string, shippingAddress: string) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify({
        payment_method: paymentMethod,
        shipping_address: shippingAddress
      }),
    });
  }

  async createOrderWithProof(formData: FormData) {
    return this.request('/orders', {
      method: 'POST',
      body: formData, // FormData is sent directly, Content-Type is auto-set by browser
    });
  }

  async getMyOrders() {
    return this.request<{ orders: any[] }>('/orders/my-orders');
  }

  async confirmOrderDelivery(orderId: string) {
    return this.request(`/orders/${orderId}/confirm-delivery`, {
      method: 'POST',
    });
  }

  async getOrder(id: string) {
    return this.request<{ order: any }>(`/orders/${id}`);
  }

  // ============== MESSAGES ENDPOINTS ==============

  async getMessages() {
    return this.request<{ messages: any[] }>('/messages');
  }

  async sendMessage(content: string) {
    return this.request('/messages/send', {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  async markMessageAsRead(messageId: string) {
    return this.request(`/messages/${messageId}/read`, {
      method: 'PUT',
    });
  }

  async getUnreadCount() {
    return this.request<{ count: number }>('/messages/unread-count');
  }

  // ============== ADMIN ENDPOINTS ==============

  async getAllUsers() {
    return this.request<{ users: any[] }>('/users');
  }

  async updateUser(userId: string, data: any) {
    return this.request(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteUser(userId: string) {
    return this.request(`/users/${userId}`, {
      method: 'DELETE',
    });
  }

  async getAllOrders() {
    return this.request<{ orders: any[] }>('/orders');
  }

  async updateOrderStatus(orderId: string, status: string) {
    return this.request(`/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async getAllMessages() {
    return this.request<{ messages: any[] }>('/messages/all');
  }

  async replyToMessage(messageId: string, content: string) {
    return this.request(`/messages/${messageId}/reply`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  // ============== ADMIN ORDERS MANAGEMENT ==============

  async getPendingOrders() {
    return this.request<{ orders: any[] }>('/admin/orders/pending');
  }

  async approveOrder(orderId: string) {
    return this.request(`/admin/orders/${orderId}/approve`, {
      method: 'POST',
    });
  }

  async rejectOrder(orderId: string, reason: string = "") {
    return this.request(`/admin/orders/${orderId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  // ============== ADMIN DELIVERIES MANAGEMENT ==============

  async getPendingDeliveries() {
    return this.request<{ deliveries: any[] }>('/admin/deliveries/pending');
  }

  async getInProgressDeliveries() {
    return this.request<{ deliveries: any[] }>('/admin/deliveries/in-progress');
  }

  async getAllDeliveries() {
    return this.request<{ deliveries: any[] }>('/admin/deliveries/all');
  }

  async startDelivery(deliveryId: string) {
    return this.request(`/admin/deliveries/${deliveryId}/start`, {
      method: 'POST',
    });
  }

  async markDeliveryCompleted(deliveryId: string) {
    return this.request(`/admin/deliveries/${deliveryId}/complete`, {
      method: 'POST',
    });
  }

  // ============== HEALTH CHECK ==============

  async healthCheck() {
    return this.request<{ status: string }>('/health');
  }
}

export const apiService = new ApiService(API_BASE_URL);