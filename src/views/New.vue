<template>
  <div class="background-container">
    <div class="new-container">
      <h1 class="new-title">Add a place to your journey!</h1>

      <form class="ui form" @submit.prevent="onSubmit">
        <div class="field">
          <label class="bold-label">📍 What's this place called?</label>
          <input type="text" required v-model="travel.place" placeholder="e.g. Tokyo Tower" />
        </div>

        <div class="field">
          <label class="bold-label">📝 Any thoughts or memories?</label>
          <textarea v-model="travel.notes" rows="3" placeholder="e.g. Amazing view at night!"></textarea>
        </div>

        <div class="field">
          <label class="bold-label">🗓️ When did you travel here? (Or planning to go?)</label>
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
          }[dateStatus]">
            {{ computedStatus.charAt(0).toUpperCase() + computedStatus.slice(1) }}
          </n-tag>

        </div>

        <div class="field">
          <label class="bold-label">📸 Got a photo to add? (Or maybe not)</label>
          <input type="file" @change="handleImage" />
          <div v-if="uploading">Uploading...</div>
          <div v-if="travel.imageUrl">
            <img :src="travel.imageUrl" alt="preview" class="preview-image" />
          </div>
        </div>

        <div class="field">
          <div class="ui checkbox">
            <input type="checkbox" v-model="travel.favorite" />
            <label class="bold-label">⭐ Pin this as a favorite?</label>
          </div>
        </div>

        <div class="submit-container">
          <button class="ui green big button" type="submit">Submit</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import api from '@/helpers/axios'
import { addNewTravel } from '@/helpers/api'

export default {
  name: 'New',
  setup() {
    const router = useRouter()

    const travel = ref({
      place: '',
      notes: '',
      favorite: false,
      imageUrl: '',
      travelDate: null
    })

    const uploading = ref(false)

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

      travel.value.status = dateStatus.value

      await addNewTravel(travel.value)
      Swal.fire('Added!', 'New travel log has been saved.', 'success')
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
.background-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f1f8fa;
  padding: 2rem;
}

html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}

.new-container {
  background-color: rgba(255, 255, 255, 0.96);
  padding: 2.5rem 3.5rem;
  border-radius: 10px;
  width: 100%;
  max-width: 620px;
  margin: 4rem auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.ui.form .field input,
.ui.form .field textarea {
  font-size: 1.1rem;
  padding: 0.75rem;
}

.ui.green.button {
  padding: 0.75rem 2.5rem;
  font-size: 1.1rem;
  border-radius: 6px;
}

.new-title {
  text-align: center;
  font-weight: bold;
  font-size: 2rem;
  margin-bottom: 2rem;
}

.bold-label {
  font-weight: bold;
  font-size: 1rem;
}

.submit-container {
  text-align: center;
  margin-top: 2rem;
}

.preview-image {
  max-height: 120px;
  margin-top: 1rem;
  border-radius: 6px;
}
</style>
