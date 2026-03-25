import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useHistoryStore = defineStore('history', () => {
  const historyRecords = ref([])

  function addHistoryRecord(record) {
    // 添加新记录到开头
    historyRecords.value.unshift(record)
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
        taskName: '未命名1',
        detectionTime: new Date(Date.now() - 86400000).toLocaleString('zh-CN'),
        uploadType: '单张图片',
        defectCount: 5,
        reportData: {
          task_summary: {
            image_count: 2,
            total_defect_count: 5,
            class_count: {
              crack: 3,
              efflorescence: 1,
              'exposed rebar': 0,
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

  // 删除选中的历史记录
  function deleteSelectedRecords(ids) {
    historyRecords.value = historyRecords.value.filter(record => !ids.includes(record.id))
    // 保存到本地存储
    localStorage.setItem('bridgeHistoryRecords', JSON.stringify(historyRecords.value))
  }

  // 更新任务名称
  function updateTaskName(id, newName) {
    const record = historyRecords.value.find(record => record.id === id)
    if (record) {
      record.taskName = newName
      // 保存到本地存储
      localStorage.setItem('bridgeHistoryRecords', JSON.stringify(historyRecords.value))
    }
  }

  return { 
    historyRecords, 
    addHistoryRecord, 
    loadHistoryRecords,
    deleteSelectedRecords,
    updateTaskName
  }
})