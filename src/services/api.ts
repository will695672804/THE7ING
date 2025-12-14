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

  async getCourses(params?: { category?: string; level?: string; search?: string }) {
    const queryString = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : '';
    return this.request<{ courses: any[]; pagination?: any }>(`/courses${queryString}`);
  }

  async getCourse(id: string) {
    return this.request<{ course: any }>(`/courses/${id}`);
  }

  async createCourse(courseData: FormData) {
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

  // ============== SECTIONS ENDPOINTS ==============

  async createSection(courseId: string, data: { title: string; description?: string; orderIndex?: number }) {
    return this.request(`/courses/${courseId}/sections`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateSection(sectionId: string, data: { title?: string; description?: string; orderIndex?: number }) {
    return this.request(`/courses/sections/${sectionId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteSection(sectionId: string) {
    return this.request(`/courses/sections/${sectionId}`, {
      method: 'DELETE',
    });
  }

  async reorderSections(courseId: string, sectionIds: string[]) {
    return this.request(`/courses/${courseId}/sections/reorder`, {
      method: 'PUT',
      body: JSON.stringify({ section_ids: sectionIds }),
    });
  }

  // ============== LECTURES (VIDEOS) ENDPOINTS ==============

  async createLecture(sectionId: string, lectureData: FormData) {
    return this.request(`/courses/sections/${sectionId}/lectures`, {
      method: 'POST',
      body: lectureData,
    });
  }

  async updateLecture(lectureId: string, lectureData: FormData) {
    return this.request(`/courses/lectures/${lectureId}`, {
      method: 'PUT',
      body: lectureData,
    });
  }

  async deleteLecture(lectureId: string) {
    return this.request(`/courses/lectures/${lectureId}`, {
      method: 'DELETE',
    });
  }

  async addLectureResource(lectureId: string, resourceData: FormData) {
    return this.request(`/courses/lectures/${lectureId}/resources`, {
      method: 'POST',
      body: resourceData,
    });
  }

  async deleteLectureResource(resourceId: string) {
    return this.request(`/courses/lecture-resources/${resourceId}`, {
      method: 'DELETE',
    });
  }

  // ============== ENROLLMENT & PROGRESS ENDPOINTS ==============

  async enrollInCourse(courseId: string) {
    return this.request(`/courses/${courseId}/enroll`, {
      method: 'POST',
    });
  }

  async getCourseProgress(courseId: string) {
    return this.request<{ enrollment: any; lectureProgresses: any[] }>(`/courses/${courseId}/progress`);
  }

  async getMyEnrolledCourses() {
    return this.request<{ courses: any[] }>('/courses/my-courses');
  }

  async completeLecture(lectureId: string) {
    return this.request(`/courses/lectures/${lectureId}/complete`, {
      method: 'POST',
    });
  }

  async saveLectureProgress(lectureId: string, data: { videoPosition: number; timeWatched?: number }) {
    return this.request(`/courses/lectures/${lectureId}/save-progress`, {
      method: 'POST',
      body: JSON.stringify({
        video_position: data.videoPosition,
        time_watched: data.timeWatched || 0,
      }),
    });
  }

  async getCertificate(enrollmentId: string) {
    return this.request<{ certificate: any }>(`/courses/enrollments/${enrollmentId}/certificate`);
  }

  // ============== NOTES ENDPOINTS ==============

  async getCourseNotes(courseId: string) {
    return this.request<{ notes: any[] }>(`/courses/${courseId}/notes`);
  }

  async createNote(lectureId: string, data: { content: string; timestamp: number }) {
    return this.request(`/courses/lectures/${lectureId}/notes`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateNote(noteId: string, data: { content: string }) {
    return this.request(`/courses/notes/${noteId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteNote(noteId: string) {
    return this.request(`/courses/notes/${noteId}`, {
      method: 'DELETE',
    });
  }

  // ============== BOOKMARKS ENDPOINTS ==============

  async getCourseBookmarks(courseId: string) {
    return this.request<{ bookmarks: any[] }>(`/courses/${courseId}/bookmarks`);
  }

  async createBookmark(lectureId: string, data: { title?: string; timestamp: number }) {
    return this.request(`/courses/lectures/${lectureId}/bookmarks`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteBookmark(bookmarkId: string) {
    return this.request(`/courses/bookmarks/${bookmarkId}`, {
      method: 'DELETE',
    });
  }

  // ============== Q&A ENDPOINTS ==============

  async getLectureQuestions(lectureId: string) {
    return this.request<{ questions: any[] }>(`/courses/lectures/${lectureId}/questions`);
  }

  async getQuestion(questionId: string) {
    return this.request<{ question: any }>(`/courses/questions/${questionId}`);
  }

  async createQuestion(lectureId: string, data: { title: string; content: string }) {
    return this.request(`/courses/lectures/${lectureId}/questions`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async upvoteQuestion(questionId: string) {
    return this.request(`/courses/questions/${questionId}/upvote`, {
      method: 'POST',
    });
  }

  async createAnswer(questionId: string, data: { content: string }) {
    return this.request(`/courses/questions/${questionId}/answers`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async acceptAnswer(answerId: string) {
    return this.request(`/courses/answers/${answerId}/accept`, {
      method: 'POST',
    });
  }

  async upvoteAnswer(answerId: string) {
    return this.request(`/courses/answers/${answerId}/upvote`, {
      method: 'POST',
    });
  }

  // ============== REVIEWS ENDPOINTS ==============

  async getCourseReviews(courseId: string) {
    return this.request<{ reviews: any[]; averageRating: number; totalReviews: number }>(`/courses/${courseId}/reviews`);
  }

  async createReview(courseId: string, data: { rating: number; title?: string; comment: string }) {
    return this.request(`/courses/${courseId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateReview(reviewId: string, data: { rating?: number; title?: string; comment?: string }) {
    return this.request(`/courses/reviews/${reviewId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteReview(reviewId: string) {
    return this.request(`/courses/reviews/${reviewId}`, {
      method: 'DELETE',
    });
  }

  async markReviewHelpful(reviewId: string) {
    return this.request(`/courses/reviews/${reviewId}/helpful`, {
      method: 'POST',
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