<template>
  <div class="edit-container">
    <h1 class="form-title">Tweak the details?</h1>

    <form class="ui form" @submit.prevent="onSubmit">
      <div class="field">
        <label class="bold-label">📍 What's it called again?</label>
        <input type="text" required v-model="travel.place" />
      </div>

      <div class="field">
        <label class="bold-label">📝 Any new details or memories?</label>
        <textarea v-model="travel.notes" rows="3"></textarea>
      </div>

      <div class="field">
        <label class="bold-label">🗓️ When did you travel here? (Or still planning?)</label>
        <n-date-picker
          v-model:value="travel.travelDate"
          type="date"
          clearable
          size="medium"
          style="width: 100%;"
        />
      </div>

      <div class="field">
        <label class="bold-label">🤔 Have we been here before? (Automatically updates on date)</label><br />
        <n-tag :type="{
          visited: 'success',
          planned: 'warning',
          wishlist: 'info'
        }[computedStatus]">
          {{ dateStatus.charAt(0).toUpperCase() + dateStatus.slice(1) }}
        </n-tag>
      </div>

      <div class="field">
        <label class="bold-label">📸 Wanna update the view?</label>
        <input type="file" @change="handleImage" />
        <div v-if="uploading">Uploading...</div>
        <div v-if="travel.imageUrl">
          <img :src="travel.imageUrl" alt="Preview" class="preview-image" />
        </div>
      </div>

      <div class="field">
        <div class="ui checkbox">
          <input type="checkbox" v-model="travel.favorite" />
          <label class="bold-label">⭐ (Still) one of your Favorite?</label>
        </div>
      </div>

      <div class="submit-container">
        <button class="ui primary big button" type="submit">Update</button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { viewTravelById, editTravel } from '@/helpers/api'
import api from '@/helpers/axios'
import Swal from 'sweetalert2'

export default {
  name: 'Edit',
  setup() {
    const travel = ref({
      place: '',
      notes: '',
      favorite: false,
      imageUrl: '',
      travelDate: null
    })

    const uploading = ref(false)
    const route = useRoute()
    const router = useRouter()

    onMounted(async () => {
      const result = await viewTravelById(route.params.id)
      if (!result) {
        alert("Failed to load data.")
        return
      }

      travel.value = {
        ...result,
        travelDate: result.travelDate || null
      }
    })

    const dateStatus = computed(() => {
      const date = travel.value.travelDate
      if (!date) return 'wishlist'

      const selected = new Date(date)
      const today = new Date()
      selected.setHours(0, 0, 0, 0)
      today.setHours(0, 0, 0, 0)

      return selected > today ? 'planned' : 'visited'
    })

    const handleImage = async (e) => {
      const file = e.target.files[0]
      if (!file) return

      const formData = new FormData()
      formData.append('image', file)
      uploading.value = true

      try {
        const res = await api.post('/travels/upload', formData)
        travel.value.imageUrl = res.data.imageUrl
      } catch (err) {
        console.error('Upload failed:', err)
      } finally {
        uploading.value = false
      }
    }

    const onSubmit = async () => {
    if (!travel.value.notes.trim() || !travel.value.travelDate) {
        Swal.fire({
        icon: 'warning',
        title: 'Not so fast! ✋',
        text: "Don’t forget add a date along with some notes!"
        })
        return
    }

    travel.value.status = computedStatus.value

    const result = await editTravel(route.params.id, travel.value)
    if (!result) {
        Swal.fire('Error', 'Update failed. Try again.', 'error')
        return
    }
    Swal.fire('Updated!', 'Travel log has been updated.', 'success')
        .then(() => router.push('/travels'))
    }

    return {
      travel,
      uploading,
      handleImage,
      onSubmit,
      dateStatus
    }
  }
}
</script>

<style scoped>
.edit-container {
  max-width: 640px;
  margin: 3rem auto;
  padding: 2rem;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.form-title {
  text-align: center;
  font-weight: bold;
  font-size: 2rem;
  margin-bottom: 2rem;
}

.bold-label {
  font-weight: bold;
  font-size: 1rem;
}

.preview-image {
  max-height: 160px;
  margin-top: 1rem;
  border-radius: 6px;
  object-fit: cover;
}

.submit-container {
  text-align: center;
  margin-top: 2rem;
}

.ui.form .field input,
.ui.form .field textarea {
  font-size: 1rem;
  padding: 0.75rem;
  width: 100%;
}
</style>