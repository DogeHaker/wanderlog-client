<template>
  <div class="login-page">
    <div class="login-box">
      <!-- Logo and title -->
      <div class="logo-header">
        <img src="@/assets/logowander.png" alt="Logo" class="logo-icon" />
        <br />
        <span>WanderLog</span>
      </div>

      <!-- Username input -->
      <n-input
        v-model:value="username"
        placeholder="What's your name, explorer?"
        size="large"
      />

      <!-- Password input with toggle -->
      <div class="password-toggle">
        <n-input
          v-model:value="password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Secret code, please"
          size="large"
        />
        <button class="toggle-btn" @click="showPassword = !showPassword">
          {{ showPassword ? '🙈' : '👁️' }}
        </button>
      </div>

      <!-- Login button -->
      <n-button type="primary" size="large" block @click="onLogin">
        Login
      </n-button>

      <!-- Register link -->
      <router-link to="/register" class="register-link">
        First time here? <strong>Start your journey!</strong>
      </router-link>
    </div>
  </div>
</template>

<script>
import api from '@/helpers/axios'
import Swal from 'sweetalert2'

export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
      showPassword: false
    }
  },
  methods: {
    async onLogin() {
      if (!this.username.trim() || !this.password.trim()) {
        Swal.fire('Oops!', 'Username and password are both needed to check in!', 'warning')
        return
      }

      try {
        const res = await api.post('/auth/login', {
          username: this.username,
          password: this.password
        })

        localStorage.setItem('token', res.data.token)
        localStorage.setItem('username', res.data.username)

        Swal.fire({
          title: 'Welcome back!',
          text: `Good to see you again, ${res.data.username}`,
          icon: 'success',
          confirmButtonColor: '#1565c0'
        }).then(() => {
          setTimeout(() => {
            this.$router.push('/travels')
          }, 100)
        })

      } catch (err) {
        Swal.fire('Login Failed', 'Are your details correct? Give it another go', 'error')
        console.error(err)
      }
    }
  }
}
</script>

<style scoped>
.login-page {
  background-image: url('../assets/addnewblue.jpg');
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-box {
  background: rgba(255, 255, 255, 0.9);
  padding: 2rem 2.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 350px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.logo-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  margin-bottom: 0.5rem;
  font-size: 1.8rem;
  font-weight: bold;
  color: #1565c0;
}

.logo-icon {
  height: 42px;
  width: 42px;
}

.register-link {
  margin-top: 0.5rem;
  font-size: 0.95rem;
  color: #1565c0;
  text-decoration: none;
  display: inline-block;
}

.register-link strong {
  color: #0d47a1;
}

.register-link:hover {
  text-decoration: underline;
}

/* Toggle password button */
.password-toggle {
  position: relative;
}

.toggle-btn {
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
}
</style>