<template>
  <div class="auth-layout">
    <header class="auth-header">
    </header>

    <main class="auth-content">
      <router-view />
    </main>

    <footer class="auth-footer">
      <p>© 2025 MyCompany. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup>

</script>

<style scoped>
.auth-layout {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh; /* Высота экрана */
  background-color: #f4f6f9; /* Светлый фон */
}

.auth-header {
  margin-bottom: 20px;
}

.logo {
  width: 150px;
}

.auth-content {
  width: 100%;
  max-width: 600px; /* Максимальная ширина для форм */
  background: #fff;
  padding: 40px 20px 20px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.auth-footer {
  margin-top: 20px;
  font-size: 0.875rem;
  color: #777;
}
</style>
