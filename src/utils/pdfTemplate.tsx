import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFViewer, Font } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';

// Register fonts
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf', fontWeight: 300 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf', fontWeight: 400 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf', fontWeight: 500 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 700 },
  ],
});

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#FF8C00',
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 10,
    color: '#666666',
    fontFamily: 'Helvetica',
  },
  section: {
    margin: 10,
    padding: 10,
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#bfbfbf',
    borderBottomStyle: 'solid',
    minHeight: 30,
  },
  tableHeader: {
    backgroundColor: '#FF8C00',
    color: '#ffffff',
  },
  tableCell: {
    padding: 5,
    flex: 1,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  headerCell: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: '#666666',
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
});

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  activeCustomers: number;
  avgOrderValue: number;
  analytics: {
    revenueGrowth: number;
    avgOrderValueGrowth: number;
    ordersGrowth: number;
    customersGrowth: number;
  };
  menuItems: Array<{
    name: string;
    category: string;
    price: number;
  }>;
  customers: Array<{
    name: string;
    membershipTier: string;
    lastOrderDate: string;
  }>;
  filteredOrders: Array<{
    customer: string;
    productName: string;
    quantity: number;
    total: number;
  }>;
}

// Helper component for tables
const Table = ({ data, headers }: { data: string[][]; headers: string[] }) => (
  <View style={styles.table}>
    <View style={[styles.tableRow, styles.tableHeader]}>
      {headers.map((header, i) => (
        <Text key={i} style={[styles.tableCell, styles.headerCell]}>
          {header}
        </Text>
      ))}
    </View>
    {data.map((row, i) => (
      <View key={i} style={styles.tableRow}>
        {row.map((cell, j) => (
          <Text key={j} style={styles.tableCell}>
            {cell}
          </Text>
        ))}
      </View>
    ))}
  </View>
);

// Main PDF Document component
const AnalyticsPDF = ({ data, dateRange }: { data: AnalyticsData; dateRange?: DateRange }) => {
  // Process product stats
  const productStats = new Map();
  data.menuItems.forEach(item => {
    productStats.set(item.name, {
      name: item.name,
      sales: 0,
      revenue: 0,
      category: item.category,
      price: item.price
    });
  });

  data.filteredOrders.forEach(order => {
    const stats = productStats.get(order.productName);
    if (stats) {
      stats.sales += order.quantity;
      stats.revenue += Number(order.total) || 0;
    }
  });

  const productTableData = Array.from(productStats.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 20)
    .map(prod => [
      prod.name,
      prod.category,
      `$${prod.price.toFixed(2)}`,
      prod.sales.toString(),
      `$${prod.revenue.toFixed(2)}`,
      `${((prod.revenue / data.totalRevenue) * 100).toFixed(1)}%`
    ]);

  // Process customer stats
  const customerStats = new Map();
  data.customers.forEach(customer => {
    customerStats.set(customer.name, {
      ...customer,
      totalOrders: 0,
      totalRevenue: 0
    });
  });

  data.filteredOrders.forEach(order => {
    const stats = customerStats.get(order.customer);
    if (stats) {
      stats.totalOrders++;
      stats.totalRevenue += Number(order.total) || 0;
    }
  });

  const customerTableData = Array.from(customerStats.values())
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 10)
    .map(customer => {
      const avgOrderValue = customer.totalOrders ? (customer.totalRevenue / customer.totalOrders) : 0;
      return [
        customer.name,
        customer.membershipTier,
        customer.totalOrders.toString(),
        `$${customer.totalRevenue.toFixed(2)}`,
        `$${avgOrderValue.toFixed(2)}`,
        customer.lastOrderDate
      ];
    });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Slice Savvy Analytics Report</Text>
        
        {dateRange?.from && dateRange?.to && (
          <Text style={styles.subtitle}>
            Date Range: {format(dateRange.from, 'MMMM dd, yyyy')} - {format(dateRange.to, 'MMMM dd, yyyy')}
          </Text>
        )}

        <View style={styles.section}>
          <Text style={styles.subtitle}>Executive Summary</Text>
          <Text style={styles.tableCell}>Total Revenue: ${data.totalRevenue.toFixed(2)}</Text>
          <Text style={styles.tableCell}>Total Orders: {data.totalOrders}</Text>
          <Text style={styles.tableCell}>Active Customers: {data.activeCustomers}</Text>
          <Text style={styles.tableCell}>Average Order Value: ${data.avgOrderValue.toFixed(2)}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subtitle}>Revenue Analysis</Text>
          <Table
            headers={['Metric', 'Value', 'Change']}
            data={[
              ['Total Revenue', `$${data.totalRevenue.toFixed(2)}`, `${data.analytics.revenueGrowth}%`],
              ['Average Order Value', `$${data.avgOrderValue.toFixed(2)}`, `${data.analytics.avgOrderValueGrowth}%`],
              ['Orders Growth', `${data.totalOrders}`, `${data.analytics.ordersGrowth}%`],
              ['Customer Growth', `${data.activeCustomers}`, `${data.analytics.customersGrowth}%`]
            ]}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.subtitle}>Product Performance</Text>
          <Table
            headers={['Product', 'Category', 'Price', 'Units Sold', 'Revenue', 'Revenue %']}
            data={productTableData}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.subtitle}>Customer Analysis</Text>
          <Table
            headers={['Customer', 'Membership', 'Orders', 'Revenue', 'Avg Order Value', 'Last Order']}
            data={customerTableData}
          />
        </View>

        <Text style={styles.footer}>Generated on {format(new Date(), 'MMMM dd, yyyy')}</Text>
      </Page>
    </Document>
  );
};

// PDF Viewer component
const PDFViewerComponent: React.FC<{ data: AnalyticsData; dateRange?: DateRange }> = ({ data, dateRange }) => {
  return (
    <PDFViewer style={{ width: '100%', height: '100%' }}>
      <AnalyticsPDF data={data} dateRange={dateRange} />
    </PDFViewer>
  );
};

export { PDFViewerComponent }; 