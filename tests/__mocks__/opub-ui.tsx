import React from 'react';

export const Button = ({ children, onClick, kind, ...props }: any) => (
  <button onClick={onClick} data-kind={kind} {...props}>
    {children}
  </button>
);

export const Text = ({ children, ...props }: any) => (
  <span {...props}>{children}</span>
);

export const Spinner = ({ color }: any) => (
  <div color={color} data-testid="spinner">
    spinner
  </div>
);

export const Tabs = ({ children, defaultValue }: any) => {
  return (
    <div data-testid="tabs" data-default={defaultValue}>
      {children}
    </div>
  );
};

export const TabList = ({ children }: any) => {
  return <div data-testid="tab-list">{children}</div>;
};

export const Tab = ({ children, value }: any) => {
  return (
    <div data-testid="tab" data-value={value}>
      {children}
    </div>
  );
};

export const TabPanel = ({ children, value }: any) => {
  return (
    <div data-testid="tab-panel" data-value={value}>
      {children}
    </div>
  );
};

export const Select = ({
  value,
  onChange,
  options,
  label,
  name,
  id,
  ...props
}: any) => (
  <div>
    {/* Provide accessible label and test id based on name */}
    <label htmlFor={id || name}>{label}</label>
    <select
      id={id || name}
      name={name}
      aria-label={label}
      data-testid={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      {...props}
    >
      {options?.map((option: any) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

export const MonthPicker = ({
  value,
  onChange,
  minValue,
  maxValue,
  label,
  name,
  defaultValue,
  ...props
}: any) => (
  <div data-testid="month-picker">
    <input
      type="month"
      aria-label={label || 'Select Month'}
      name={name}
      value={value}
      // Expose limits for assertions
      data-min={minValue ? JSON.stringify(minValue) : undefined}
      data-max={maxValue ? JSON.stringify(maxValue) : undefined}
      onChange={(e) => onChange?.(e.target.value)}
      {...props}
    />
  </div>
);

export const MultiMonthPicker = ({
  onChange,
  selectedValues,
  label,
  minValue,
  maxValue,
  ...props
}: any) => (
  <div data-testid="multi-month-picker">
    <input
      type="month"
      aria-label={label || 'Select Months'}
      // Uncontrolled to allow typing in tests
      defaultValue=""
      onChange={(e) => {
        const val = e.target.value; // format: YYYY-MM
        if (onChange && val) {
          const [yearStr, monthStr] = val.split('-');
          const year = parseInt(yearStr, 10);
          const month = parseInt(monthStr, 10);
          onChange([{ year, month, day: 1 }]);
        }
      }}
      data-selected-values={
        selectedValues ? JSON.stringify(selectedValues) : undefined
      }
      // Do not forward minValue/maxValue to avoid React unknown prop warnings
      {...props}
    />
  </div>
);

export const Icon = ({ source, ...props }: any) => (
  <span data-testid="icon" {...props} />
);

export const RadioGroup = ({
  children,
  value,
  onChange,
  'data-testid': testId,
}: any) => (
  <div data-testid={testId || 'radio-group'} data-value={value}>
    {children}
  </div>
);

export const RadioItem = ({
  children,
  value,
  checked,
  onChange,
  'data-testid': testId,
}: any) => (
  <label
    data-testid={testId || 'radio-item'}
    data-value={value}
    data-checked={checked}
  >
    <input type="radio" value={value} checked={checked} onChange={onChange} />
    {children}
  </label>
);

export const YearCalendar = ({
  value,
  onChange,
  minValue,
  maxValue,
  'data-testid': testId,
  ...props
}: any) => (
  <div data-testid={testId || 'year-calendar'}>
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      min={minValue}
      max={maxValue}
      {...props}
    />
  </div>
);

// Additional components for analytics
export const Table = ({
  columns,
  rows,
  theme,
  hasZebraStripingOnData,
  sortColumns,
  truncate,
}: any) => (
  <div data-testid="table" data-theme={theme}>
    <table>
      <thead>
        <tr>
          {columns?.map((col: any, index: number) => (
            <th key={index} data-testid={`header-${col.accessorKey}`}>
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows?.map((row: any, rowIndex: number) => (
          <tr key={rowIndex} data-testid={`row-${rowIndex}`}>
            {columns?.map((col: any, colIndex: number) => (
              <td
                key={colIndex}
                data-testid={`cell-${rowIndex}-${col.accessorKey}`}
              >
                {row[col.accessorKey]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const ProgressBar = ({ size, customColor, value }: any) => (
  <div
    data-testid="progress-bar"
    data-size={size}
    data-value={value}
    style={{ backgroundColor: customColor }}
  >
    <div style={{ width: `${value}%` }}></div>
  </div>
);

export const Tooltip = ({ content, children }: any) => (
  <div data-testid="tooltip">
    {children}
    <div data-testid="tooltip-content">{content}</div>
  </div>
);

export const Accordion = ({
  children,
  type,
  defaultValue,
  collapsible,
}: any) => (
  <div
    data-testid="accordion"
    data-type={type}
    data-default={defaultValue}
    data-collapsible={collapsible}
  >
    {children}
  </div>
);

export const AccordionItem = ({ children, value, className }: any) => (
  <div data-testid="accordion-item" data-value={value} className={className}>
    {children}
  </div>
);

export const AccordionTrigger = ({ children }: any) => (
  <button data-testid="accordion-trigger">{children}</button>
);

export const AccordionContent = ({ children, className }: any) => (
  <div data-testid="accordion-content" className={className}>
    {children}
  </div>
);

export const Menu = ({ children, trigger }: any) => (
  <div data-testid="menu">
    {trigger}
    <div data-testid="menu-content">{children}</div>
  </div>
);

export const Divider = ({ className }: any) => (
  <hr data-testid="divider" className={className} />
);

export const ShareDialog = ({
  children,
  kind,
  size,
  image,
  loading,
  alt,
  title,
  props,
  onOpen,
  onDownload,
}: any) => (
  <div
    data-testid="share-dialog"
    data-kind={kind}
    data-size={size}
    data-loading={loading}
  >
    <button onClick={onOpen} data-testid="share-dialog-open">
      Open
    </button>
    <button onClick={onDownload} data-testid="share-dialog-download">
      Download
    </button>
    {children}
  </div>
);

export const useScreenshot = () => ({
  createSvg: jest.fn(() => Promise.resolve('svg-data')),
  svgToPngURL: jest.fn(() => Promise.resolve('png-url')),
  downloadFile: jest.fn(),
  domToUrl: jest.fn(() => Promise.resolve('dom-url')),
});

// Chart components
export const BarChart = ({ options, height, showLabel }: any) => (
  <div data-testid="bar-chart" style={{ height }}>
    <div data-testid="chart-options">{JSON.stringify(options)}</div>
    <div data-testid="chart-show-label">{showLabel ? 'true' : 'false'}</div>
  </div>
);

export const LineChart = ({ options, height }: any) => (
  <div data-testid="line-chart" style={{ height }}>
    <div data-testid="chart-options">{JSON.stringify(options)}</div>
    <div data-testid="chart-show-label">
      {options && options.series && options.series[0] && options.series[0].label
        ? options.series[0].label.show
        : false}
    </div>
  </div>
);

// Viz components
export const AreaChart = ({ options, height }: any) => (
  <div data-testid="area-chart" style={{ height }}>
    <div data-testid="chart-options">{JSON.stringify(options)}</div>
  </div>
);

export const PieChart = ({ options, height }: any) => (
  <div data-testid="pie-chart" style={{ height }}>
    <div data-testid="chart-options">{JSON.stringify(options)}</div>
  </div>
);

export const ScatterChart = ({ options, height }: any) => (
  <div data-testid="scatter-chart" style={{ height }}>
    <div data-testid="chart-options">{JSON.stringify(options)}</div>
  </div>
);

// Export all components
export default {
  Button,
  Text,
  Spinner,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Select,
  MonthPicker,
  MultiMonthPicker,
  Icon,
  RadioGroup,
  RadioItem,
  YearCalendar,
  Table,
  ProgressBar,
  Tooltip,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Menu,
  Divider,
  ShareDialog,
  useScreenshot,
  BarChart,
  LineChart,
  AreaChart,
  PieChart,
  ScatterChart,
};
