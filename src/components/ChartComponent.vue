<template>
  <div>
    <div>
      <el-form label-position="left">
        <el-form-item label="Select Days">
          <el-select v-model="selectedDays" @change="updateChartData">
            <el-option label="Last 7 Days" value="7"></el-option>
            <el-option label="Last 14 Days" value="14"></el-option>
            <el-option label="Last 30 Days" value="30"></el-option>
            <el-option label="Last 60 Days" value="60"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div id="chart-container"></div>
    <div id="table-container" v-if="showTable">
      <el-table :data="displayedTableData" style="width: 100%">
        <el-table-column label="SKU" prop="sku.sku"></el-table-column>
        <el-table-column
          label="Product Name"
          prop="sku.productName"
        ></el-table-column>
        <el-table-column
          :label="`${selectedColumns[0].date} Sales / Units Avg. Selling Price`"
        >
          <template v-slot="scope">
            {{ `${scope.row.sku.sortingAmount} / ${scope.row.refundAmount}` }}
          </template>
        </el-table-column>

        <el-table-column
          v-if="selectedColumns[1]"
          :label="`${selectedColumns[1].date} Sales / Units Avg. Selling Price`"
        >
          <template v-slot="scope">
            {{ `${scope.row.sku.shippingAmount2} / ${scope.row.refundAmount}` }}
          </template>
        </el-table-column>

        <el-table-column
          v-else
          :label="`${selectedColumns[0].date} Sales / Units Avg. Selling Price`"
        >
          <template v-slot="scope">
            {{ `${scope.row.sku.sortingAmount} / ${scope.row.refundAmount}` }}
          </template>
        </el-table-column>

        <el-table-column
          label="SKU Refund Rate"
          prop="refundRate"
        ></el-table-column>
      </el-table>

      <div>
        <el-button @click="prevPage" :disabled="currentPage === 1" circle
          ><el-icon><ArrowLeftBold /></el-icon
        ></el-button>
        <span>{{ currentPage }} / {{ totalPages }}</span>
        <el-button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          icon="el-icon-arrow-right"
          circle
          ><el-icon><ArrowRightBold /></el-icon
        ></el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import Highcharts from 'highcharts';
import {
  ElForm,
  ElFormItem,
  ElSelect,
  ElOption,
  ElButton,
  ElTable,
  ElTableColumn,
} from 'element-plus';
import { ArrowLeftBold, ArrowRightBold } from '@element-plus/icons-vue';

const store = useStore();
const chartData = ref([]);
const selectedDays = ref(7);
const selectedColumns = ref([]);
const tableData = ref([]);
const showTable = ref(false);

onMounted(async () => {
  await fetchChartData();

  renderChart();
});

const updateChartData = async () => {
  await fetchChartData();
  renderChart();
};

const fetchChartData = async () => {
  try {
    const days = selectedDays.value; // Set the desired number of days

    // Call the action with the 'days' parameter
    await store.dispatch('chart/fetchChartInformation', { days });

    showTable.value = false;

    // Access chart data from the store
    chartData.value = store.state.chart.chartData;
  } catch (error) {
    console.error('Error fetching chart data:', error);
  }
};

const renderChart = () => {
  Highcharts.chart('chart-container', {
    chart: {
      type: 'column',
    },
    title: {
      text: 'Daily Sales Overview',
    },
    series: [
      {
        name: 'Profit',
        data: chartData.value.map((chart) => chart.profit),
      },
      {
        name: 'FBA Sales',
        data: chartData.value.map((chart) => chart.fbaAmount),
      },
      {
        name: 'FBM Sales',
        data: chartData.value.map((chart) => chart.fbmAmount),
      },
    ],
    xAxis: {
      categories: chartData.value.map((chart) => formatDate(chart.date)),
    },
    yAxis: {
      allowDecimals: false,
      min: 0,
      title: {
        text: 'Amount ($)',
      },
    },
    tooltip: {
      formatter: function () {
        const point = this.point;
        const totalSales =
          point.series.chart.series[0].yData[point.x] +
          point.series.chart.series[1].yData[point.x] +
          point.series.chart.series[2].yData[point.x];
        return `<b>${point.category}</b><br/>
                Total Sales: ${totalSales}<br/>
                Profit: ${point.series.chart.series[0].yData[point.x]}<br/>
                FBA Sales: ${point.series.chart.series[1].yData[point.x]}<br/>
                FBM Sales: ${point.series.chart.series[2].yData[point.x]}`;
      },
      shared: true,
    },
    plotOptions: {
      column: {
        stacking: 'normal',
        events: {
          click: function (event) {
            handleColumnClick(event.point.category);
          },
        },
      },
    },
  });
};

const formatDate = (dateString) => {
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  };
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', options).format(date);
};

const handleColumnClick = (columnName) => {
  const clickedDate = chartData.value.find(
    (chart) => formatDate(chart.date) === columnName,
  );

  if (selectedColumns.value.length === 2) {
    selectedColumns.value.shift();
  }
  selectedColumns.value.push(clickedDate);
  updateTablePage();

  showTable.value = true;
};

const fetchTableData = async () => {
  try {
    // Dispatch the fetchTableData action with selected columns
    await store.dispatch('chart/fetchTableData', {
      columns: selectedColumns.value,
      pageNumber: currentPage,
    });

    tableData.value = store.state.chart.tableData;
  } catch (error) {
    console.error('Error fetching table data:', error);
  }
};

const itemsPerPage = 5; // Set the number of items per page
let currentPage = 1;

const displayedTableData = computed(() => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return tableData.value.slice(startIndex, endIndex);
});

const totalPages = computed(() =>
  Math.ceil(tableData.value.length / itemsPerPage),
);

const updateTablePage = () => {
  fetchTableData();
};

const prevPage = () => {
  if (currentPage > 1) {
    currentPage--;
    updateTablePage();
  }
};

const nextPage = () => {
  if (currentPage < totalPages.value) {
    currentPage++;
    updateTablePage();
  }
};
</script>

<style scoped></style>
