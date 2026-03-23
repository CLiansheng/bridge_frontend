import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const isLoggedIn = ref(false)
  const username = ref('')
  const historyRecords = ref([])
  const currentReport = ref(null)

  function login(name) {
    isLoggedIn.value = true
    username.value = name
  }

  function addHistoryRecord(record) {
    // 添加新记录到开头
    historyRecords.value.unshift(record)
    // 限制历史记录数量为10条
    if (historyRecords.value.length > 10) {
      historyRecords.value = historyRecords.value.slice(0, 10)
    }
    // 保存到本地存储
    localStorage.setItem('bridgeHistoryRecords', JSON.stringify(historyRecords.value))
  }

  function loadHistoryRecords() {
    const storedRecords = localStorage.getItem('bridgeHistoryRecords')
    if (storedRecords) {
      historyRecords.value = JSON.parse(storedRecords)
    } else {
      // 添加示例数据
      const sampleRecord = {
        id: Date.now() - 86400000, // 1天前
        batchId: 'BATCH-20260322-001',
        detectionTime: new Date(Date.now() - 86400000).toLocaleString('zh-CN'),
        uploadType: '单张图片',
        defectCount: 5,
        reportData: {
          task_summary: {
            image_count: 2,
            total_defect_count: 5,
            class_count: {
              crack: 3,
              rust: 1,
              spalling: 1
            },
            risk_distribution: {
              low: 2,
              medium: 2,
              high: 1
            }
          },
          average_area: 980,
          average_length: 125
        }
      }
      // 使用已有方法添加示例数据
      addHistoryRecord(sampleRecord)
    }
  }

  function setCurrentReport(report) {
    currentReport.value = report
  }

  return { 
    isLoggedIn, 
    username, 
    historyRecords, 
    currentReport, 
    login, 
    addHistoryRecord, 
    loadHistoryRecords, 
    setCurrentReport 
  }
})