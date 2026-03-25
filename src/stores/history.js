import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useHistoryStore = defineStore('history', () => {
  const historyRecords = ref([])

  function addHistoryRecord(record) {
    historyRecords.value.unshift(record)
    localStorage.setItem('spansHistoryRecords', JSON.stringify(historyRecords.value))
  }

  function loadHistoryRecords() {
    const storedRecords = localStorage.getItem('spansHistoryRecords')
    if (storedRecords && JSON.parse(storedRecords).length > 0) {
      historyRecords.value = JSON.parse(storedRecords)
    } else {
      // 初始化虚拟的科幻级历史报告记录
      const mockData = [
        {
          id: Date.now() - 3600000,
          taskName: 'SEC-01 跨海大桥南段',
          detectionTime: new Date(Date.now() - 3600000).toLocaleString(),
          uploadType: 'ZIP 批量传输',
          defectCount: 8,
          resultImages: [
            { name: 'IMG_01_裂缝.jpg', url: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=800&q=80' },
            { name: 'IMG_02_泛碱.jpg', url: 'https://images.unsplash.com/photo-1590483736622-398b6ea46b41?auto=format&fit=crop&w=800&q=80' }
          ],
          aiSummaryHtml: `<p class="t-line text-orange"><span class="t-prefix">></span> 侦测到主梁结构出现多处裂缝与泛碱。</p><p class="t-line"><span class="t-prefix">></span> 建议立即派遣维护无人机进行高分子树脂填充。</p>`,
          reportData: {
            task_summary: {
              image_count: 2, total_defect_count: 8,
              class_count: { crack: 5, efflorescence: 3 },
              risk_distribution: { low: 2, medium: 4, high: 2 }
            },
            average_area: 1205, average_length: 154
          }
        },
        {
          id: Date.now() - 86400000,
          taskName: 'SEC-04 高架立交枢纽',
          detectionTime: new Date(Date.now() - 86400000).toLocaleString(),
          uploadType: '单影像上传',
          defectCount: 2,
          resultImages: [
            { name: 'IMG_04_钢筋裸露.jpg', url: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80' }
          ],
          aiSummaryHtml: `<p class="t-line text-red"><span class="t-prefix">></span> 高危警告：核心承重柱发现钢筋裸露！</p><p class="t-line"><span class="t-prefix">></span> 氧化锈蚀已发生，结构强度正在流失。</p>`,
          reportData: {
            task_summary: {
              image_count: 1, total_defect_count: 2,
              class_count: { 'exposed rebar': 2 },
              risk_distribution: { low: 0, medium: 0, high: 2 }
            },
            average_area: 4500, average_length: 320
          }
        },
        {
          id: Date.now() - 172800000,
          taskName: '未命名_郊区老桥',
          detectionTime: new Date(Date.now() - 172800000).toLocaleString(),
          uploadType: 'JPG 数据流',
          defectCount: 0,
          resultImages: [
             { name: 'IMG_09_正常.jpg', url: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=800&q=80' }
          ],
          aiSummaryHtml: `<p class="t-line text-green"><span class="t-prefix">></span> 深度扫描完毕，该区块结构完整性：100%</p><p class="t-line"><span class="t-prefix">></span> 未发现病害迹象，保持常规监测。</p>`,
          reportData: {
            task_summary: {
              image_count: 1, total_defect_count: 0,
              class_count: { },
              risk_distribution: { low: 0, medium: 0, high: 0 }
            },
            average_area: 0, average_length: 0
          }
        }
      ]
      historyRecords.value = mockData
      localStorage.setItem('spansHistoryRecords', JSON.stringify(historyRecords.value))
    }
  }

  function deleteSelectedRecords(ids) {
    historyRecords.value = historyRecords.value.filter(record => !ids.includes(record.id))
    localStorage.setItem('spansHistoryRecords', JSON.stringify(historyRecords.value))
  }

  function updateTaskName(id, newName) {
    const record = historyRecords.value.find(record => record.id === id)
    if (record) {
      record.taskName = newName
      localStorage.setItem('spansHistoryRecords', JSON.stringify(historyRecords.value))
    }
  }

  return { historyRecords, addHistoryRecord, loadHistoryRecords, deleteSelectedRecords, updateTaskName }
})