<template>
  <div class="page-container">
    <div class="glass-panel profile-card">
      <div class="avatar-section">
        <div class="avatar-wrapper">
          <img :src="avatarUrl" alt="Avatar">
          <div class="edit-overlay" @click="triggerAvatarUpload"><i class='bx bx-camera'></i></div>
          <input type="file" ref="fileInput" style="display: none" accept="image/*" @change="handleAvatarUpload">
        </div>
        <div class="user-intro">
          <h2>{{ userStore.username }}</h2>
          <p>{{ userStore.position }}</p>
        </div>
      </div>

      <div class="divider"></div>

      <div class="info-form">
        <div class="form-group">
          <label>用户名</label>
          <input type="text" v-model="userForm.username" >
        </div>
        <div class="form-group">
          <label>邮箱地址</label>
          <input type="text" v-model="userForm.email" >
        </div>
        <div class="form-group">
          <label>联系电话</label>
          <input type="text" v-model="userForm.phone">
        </div>
        <div class="form-group">
          <label>职位</label>
          <input type="text" v-model="userForm.position">
        </div>
        <button class="save-btn" @click="saveUserInfo" :disabled="!hasChanges">更新资料</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useUserStore } from '../stores/user'

const userStore = useUserStore()
const fileInput = ref(null)
const avatarUrl = ref('https://api.dicebear.com/7.x/avataaars/svg?seed=Bridge')
const userForm = ref({
  username: '',
  email: '',
  phone: '',
  position: ''
})
const originalUserInfo = ref({})

onMounted(() => {
  userStore.loadUserInfo()
  userForm.value = {
    username: userStore.username,
    email: userStore.email,
    phone: userStore.phone,
    position: userStore.position || '系统管理员 / 高级桥梁工程师'
  }
  // 保存初始用户信息用于比较
  originalUserInfo.value = { ...userForm.value }
})

const triggerAvatarUpload = () => {
  fileInput.value.click()
}

const handleAvatarUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    // 真实的头像上传逻辑
    console.log('Avatar uploaded:', file)
    // 这里可以添加实际的文件上传代码
    // 例如使用 FormData 发送到服务器
    const formData = new FormData()
    formData.append('avatar', file)
    
    // 模拟上传成功后的处理
    // 实际项目中应该使用 axios 等库发送请求
    console.log('Uploading avatar...')
    // 上传成功后更新头像URL
    // avatarUrl.value = 服务器返回的头像URL
  }
}

// 计算属性：检查用户信息是否有更改
const hasChanges = computed(() => {
  return JSON.stringify(userForm.value) !== JSON.stringify(originalUserInfo.value)
})

const saveUserInfo = () => {
  if (hasChanges.value) {
    userStore.updateUserInfo(userForm.value)
    // 更新原始信息，以便后续比较
    originalUserInfo.value = { ...userForm.value }
    alert('用户信息已更新！')
  }
}
</script>

<style scoped>
.page-container { max-width: 600px; margin: 0 auto; animation: fadeIn 0.5s ease; }
.glass-panel { border: 1px solid var(--glass-border); border-radius: 16px; padding: 40px; }
.profile-card { width: 300px;}
.avatar-section { display: flex; align-items: center; gap: 24px; }
.avatar-wrapper { position: relative; width: 80px; height: 80px; border-radius: 50%; overflow: hidden; border: 2px solid var(--neon-blue); cursor: pointer; }
.avatar-wrapper img { width: 100%; height: 100%; background: #1a202c; }
.edit-overlay { position: absolute; bottom: 0; left: 0; width: 100%; height: 30%; background: rgba(0,0,0,0.6); display: flex; justify-content: center; align-items: center; color: white; opacity: 0; transition: 0.3s; }
.avatar-wrapper:hover .edit-overlay { opacity: 1; }
.user-intro h2 { margin: 0; color: #fff; font-size: 22px; }
.user-intro p { margin: 5px 0 0 0; color: var(--text-muted); font-size: 14px; }
.divider { height: 1px; background: rgba(255,255,255,0.1); margin: 30px 0; }
.form-group { margin-bottom: 20px; display: flex; flex-direction: column; gap: 8px; }
.form-group label { color: var(--text-muted); font-size: 13px; }
.form-group input { background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); padding: 12px; border-radius: 8px; color: #fff; outline: none; transition: 0.3s; }
.form-group input:focus { border-color: var(--neon-blue); box-shadow: 0 0 0 2px rgba(0, 242, 254, 0.2); }
.save-btn { margin-top: 10px; width: 100%; background: transparent; border: 1px solid var(--neon-blue); color: var(--neon-blue); padding: 12px; border-radius: 8px; cursor: pointer; transition: 0.3s; }
.save-btn:hover:not(:disabled) { background: rgba(0, 242, 254, 0.1); box-shadow: 0 0 15px rgba(0,242,254,0.3); transform: translateY(-2px); }
.save-btn:disabled { opacity: 0.5; cursor: not-allowed; border-color: var(--text-muted); color: var(--text-muted); }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
</style>