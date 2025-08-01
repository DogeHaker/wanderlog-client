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
        placeholder="What's your explorer alias?"
        size="large"
      />

      <!-- Password input with emoji toggle -->
      <n-input
        v-model:value="password"
        :type="showPassword ? 'text' : 'password'"
        placeholder="Make your secret code"
        size="large"
      >
        <template #suffix>
          <span @click="togglePassword" style="cursor: pointer;">
            {{ showPassword ? '🙈' : '👁️' }}
          </span>
        </template>
      </n-input>

      <!-- Confirm password input with emoji toggle -->
      <n-input
        v-model:value="confirmPassword"
        :type="showConfirm ? 'text' : 'password'"
        placeholder="Confirm your secret code"
        size="large"
      >
        <template #suffix>
          <span @click="toggleConfirm" style="cursor: pointer;">
            {{ showConfirm ? '🙈' : '👁️' }}
          </span>
        </template>
      </n-input>

      <!-- Register button -->
      <n-button type="primary" size="large" block @click="onRegister">
        Register
      </n-button>

      <!-- Link to login -->
      <router-link to="/login" class="register-link">
        Already packed? <strong>Log back in!</strong>
      </router-link>
    </div>
  </div>
</template>

<script>
import api from '@/helpers/axios'
import Swal from 'sweetalert2'

export default {
  name: 'Register',
  data() {
    return {
      username: '',
      password: '',
      confirmPassword: '',
      showPassword: false,
      showConfirm: false
    }
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword
    },
    toggleConfirm() {
      this.showConfirm = !this.showConfirm
    },
    async onRegister() {
      if (!this.username.trim() || !this.password.trim() || !this.confirmPassword.trim()) {
        Swal.fire('Woah there! ✋', 'Fill out all fields before we hit the road', 'warning')
        return
      }

      if (this.password !== this.confirmPassword) {
        Swal.fire('Mismatch! ❌', 'Your passwords do not match. Try again.', 'error')
        return
      }

      try {
        await api.post('/auth/register', {
          username: this.username,
          password: this.password
        })

        const loginRes = await api.post('/auth/login', {
          username: this.username,
          password: this.password
        })

        localStorage.setItem('token', loginRes.data.token)
        localStorage.setItem('username', loginRes.data.username)

        Swal.fire({
          title: 'Yay! 🎉',
          text: `Welcome aboard, ${loginRes.data.username}`,
          icon: 'success',
          confirmButtonColor: '#1565c0'
        }).then(() => {
          this.$router.push('/travels').then(() => window.location.reload())
        })

      } catch (err) {
        const message = err.response?.data?.message || 'Something went wrong on our end. Hang tight!'
        Swal.fire('Uh oh! 😥', message, 'error')
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
</style>