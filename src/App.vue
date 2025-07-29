<template>
  <n-config-provider>
    <n-message-provider>
      <n-layout position="absolute">
        <!-- Top Navbar -->
        <n-layout-header
          v-if="$route.path !== '/login' && $route.path !== '/register'"
          style="background-color: #1565c0; color: white;"
          bordered
        >
          <div
            style="display: flex; justify-content: space-between; align-items: center; padding: 0 1.5rem; height: 60px;"
          >
            <!-- Left side: logo + nav buttons -->
            <n-space align="center" size="large">
              <!-- Logo + Title -->
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <img
                  src="./assets/logowander.png"
                  alt="WanderLog Logo"
                  style="height: 36px; border-radius: 4px;"
                />
                <span style="font-size: 1.4rem; font-weight: bold; color: white;">
                  WanderLog
                </span>
              </div>

              <!-- Nav Buttons -->
              <n-button-group>
                <n-button
                  quaternary
                  class="nav-button"
                  size="large"
                  @click="$router.push('/travels')"
                >
                  Let's see what we have here!
                </n-button>
                <n-button
                  quaternary
                  class="nav-button"
                  size="large"
                  @click="$router.push('/travels/new')"
                >
                  Got a place in mind?
                </n-button>
              </n-button-group>
            </n-space>

            <!-- Right side: login info -->
            <n-space align="center" size="medium">
              <span v-if="userId" style="color: white;">Welcome aboard, <strong>{{ userId }}</strong> 👋 </span>
              <n-button quaternary size="small" text color="white" @click="onLogout">
                Logout
              </n-button>
            </n-space>
          </div>
        </n-layout-header>

        <!-- Main Page Content -->
        <n-layout-content style="padding: 0;">
          <router-view />
        </n-layout-content>
      </n-layout>
    </n-message-provider>
  </n-config-provider>
</template>

<script>
export default {
  name: 'App',
  computed: {
    userId() {
      return localStorage.getItem('username')
    }
  },
  methods: {
    onLogout() {
      localStorage.removeItem('username')
      localStorage.removeItem('token')
      this.$router.push('/login')
    }
  },
}
</script>

<style scoped>
body {
  font-family: 'Inter', sans-serif;
  background-color: #f8f9fa;
  margin: 0;
}

/* Nav buttons hover effect */
.nav-button {
  color: white;
  font-weight: bold;
  transition: all 0.2s ease;
}

.nav-button:hover {
  color: #bbdefb;
}
</style>

<style>
/* Reset all default spacing */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  background-color: transparent;
}
</style>