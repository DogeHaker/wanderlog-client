<template>
  <div class="travel-list">
    <div class="travel-header">
      <n-h2>Your own Travel Notes 📝</n-h2>

      <!-- Filter Section -->
      <div class="travel-filters">
        <n-input
          v-model:value="filters.search"
          placeholder="Search by place..."
          clearable
          size="small"
          style="width: 180px"
          @input="fetchTravels"
      />
        <n-select
          v-model:value="filters.status"
          :options="[
            { label: 'All', value: 'all' },
            { label: 'Visited', value: 'visited' },
            { label: 'Wishlist', value: 'wishlist' },
            { label: 'Newest first', value: 'sort=desc' },
            { label: 'Oldest first', value: 'sort=asc' }
          ]"
          style="width: 120px"
          size="small"
          @update:value="fetchTravels"
        />

        <n-checkbox v-model:checked="filters.favoriteOnly" @change="fetchTravels">
          Favorites only
        </n-checkbox>
      </div>
    </div>

    <div class="empty-state" v-if="travels.length === 0">
      <div class="sad-face">˙◠˙</div>
      <br />
      <div class="empty-text">Hey, it's lonely around here!</div>
    </div>

    <n-grid cols="1 s:2 m:3" responsive="screen" x-gap="20" y-gap="20" style="width: 100%">
      <n-grid-item v-for="travel in travels" :key="travel._id">
        <n-card hoverable class="travel-card-grid">
          <img
            v-if="travel.imageUrl"
            :src="travel.imageUrl"
            alt="travel"
            class="travel-image"
          />

          <!-- Title + Star icon -->
          <div class="card-header">
            <h3>{{ travel.place }}</h3>
            <i
              v-if="travel.favorite"
              class="ri-star-fill favorite-icon"
              title="Favorite"
            ></i>
          </div>

          <p>{{ travel.notes }}</p>

          <n-tag :type="travel.status === 'visited' ? 'success' : 'info'">
            {{ travel.status }}
          </n-tag>

          <div class="created-at">
            <small>🕒 Created at: {{ formatDate(travel.createdAt) }}</small>
          </div>

          <div class="created-at" v-if="travel.travelDate">
            <small>✈️ Traveled on (Or planning to go on): {{ formatDate(travel.travelDate) }}</small>
          </div>

          <div class="travel-actions">
            <n-button size="small" @click="goEdit(travel._id)">Edit</n-button>
            <n-button size="small" type="error" @click="onDelete(travel._id)">Delete</n-button>
          </div>
        </n-card>
      </n-grid-item>
    </n-grid>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { viewAllTravels, deleteTravel } from '@/helpers/api'
import Swal from 'sweetalert2'

export default {
  name: 'Travels',
  setup() {
    const router = useRouter()
    const travels = ref([])

    const filters = ref({
      status: 'all',
      favoriteOnly: false,
      search: ''
    })

    const fetchTravels = async () => {
      let query = {}
      if (filters.value.status.startsWith('sort=')) {
        query.sort = filters.value.status.split('=')[1] // 'asc' or 'desc'
      } else if (filters.value.status !== 'all') {
        query.status = filters.value.status
      }

      if (filters.value.favoriteOnly) {
        query.favorite = 'true'
      }

      if (filters.value.search.trim() !== '') {
        query.q = filters.value.search.trim()
      }

      const queryString = new URLSearchParams(query).toString()
      travels.value = (await viewAllTravels(queryString)) || []
    }

    const onDelete = async (id) => {
      const result = await Swal.fire({
        title: 'Hold up! ✋',
        text: 'Do you really want to erase this from your log?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e53935',
        cancelButtonColor: '#b0bec5',
        confirmButtonText: "Yep, it's gone 🗑️",
        cancelButtonText: "Nvm, don't go 💖"
      })

      if (result.isConfirmed) {
        await deleteTravel(id)
        travels.value = travels.value.filter((t) => t._id !== id)
        Swal.fire({
          title: 'Buh bye! 👋',
          text: 'Your log has faded with the wind 😔',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        })
      }
    }

    const goEdit = (id) => {
      router.push(`/travels/${id}/edit`)
    }

    const formatDate = (isoString, options = { dateStyle: 'medium' }) => {
      const date = new Date(isoString)
      return date.toLocaleDateString(undefined, options)
    }

    onMounted(fetchTravels)

    return {
      travels,
      filters,
      fetchTravels,
      onDelete,
      goEdit,
      formatDate
    }
  }
}
</script>

<style scoped>
.travel-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background-color: #f5f5f5;
  min-height: 100vh;
  gap: 2rem;
}

.travel-header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 1024px;
  align-items: center;
}

.travel-filters {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.travel-card-grid {
  padding: 1rem;
  border-radius: 12px;
  overflow: hidden;
}

.travel-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 1rem;
}

.travel-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.empty-state {
  margin-top: 4rem;
  text-align: center;
  color: #888;
  animation: fadeIn 0.4s ease;
}

.sad-face {
  font-size: 3rem;
}

.empty-text {
  font-size: 1.2rem;
  margin-top: 0.5rem;
  font-weight: 500;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.favorite-icon {
  font-size: 1.3rem;
  color: #f7c948;
}

.created-at {
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: gray;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
