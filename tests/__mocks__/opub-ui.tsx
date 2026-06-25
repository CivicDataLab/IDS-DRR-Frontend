import React from 'react';

export const Button = ({ children, onClick, kind, ...props }: any) => (
  <button onClick={onClick} data-kind={kind} {...props}>
    {children}
  </button>
);

export const Text = ({ children, as, ...props }: any) => {
  const Component = as || 'span';
  return <Component {...props}>{children}</Component>;
};

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
      onChange={(e) => {
        const val = e.target.value; // "YYYY-MM"
        if (onChange && val) {
          const [yearStr, monthStr] = val.split('-');
          onChange({
            year: parseInt(yearStr, 10),
            month: parseInt(monthStr, 10),
            day: 1,
          });
        }
      }}
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
  <span data-testid="icon" data-icon={source} {...props} />
);

export const SearchInput = ({
  label,
  placeholder,
  onSubmit,
  onClear,
  onChange,
  defaultValue,
}: any) => (
  <div>
    <label>{label}</label>
    <input
      placeholder={placeholder}
      aria-label={label}
      defaultValue={defaultValue}
      onChange={(e) => onChange?.(e.target.value)}
    />
    <button type="button" onClick={() => onSubmit?.('flood')}>
      search
    </button>
    <button type="button" onClick={() => onClear?.('')}>
      clear
    </button>
  </div>
);

export const Tag = ({ children, ...props }: any) => (
  <span data-testid="tag" {...props}>
    {children}
  </span>
);

export const CheckboxGroup = ({ name, options, value, onChange }: any) => (
  <div data-testid={`checkbox-group-${name}`}>
    {options?.map((opt: { label: string; value: string }) => (
      <label key={opt.value}>
        <input
          type="checkbox"
          checked={value?.includes(opt.value)}
          onChange={() => {
            const next = value?.includes(opt.value)
              ? value.filter((v: string) => v !== opt.value)
              : [...(value || []), opt.value];
            onChange(next);
          }}
        />
        {opt.label}
      </label>
    ))}
  </div>
);

export const Tray = ({ trigger, children, open }: any) => (
  <div data-testid="tray" data-open={String(open)}>
    {trigger}
    {open ? children : null}
  </div>
);

export const Pill = ({ children, onRemove }: any) => (
  <span data-testid="pill">
    {children}
    <button type="button" aria-label="remove filter" onClick={onRemove}>
      x
    </button>
  </span>
);

export const Breadcrumb = ({ children, className }: any) => (
  <nav className={className}>{children}</nav>
);
export const BreadcrumbList = ({ children }: any) => <ol>{children}</ol>;
export const BreadcrumbItem = ({ children }: any) => <li>{children}</li>;
export const BreadcrumbLink = ({ href, children }: any) => (
  <a href={href}>{children}</a>
);
export const BreadcrumbPage = ({ children }: any) => <span>{children}</span>;
export const BreadcrumbSeparator = () => <span>/</span>;

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

export const Tooltip = Object.assign(
  ({ content, children }: any) => (
    <div data-testid="tooltip">
      {children}
      <div data-testid="tooltip-content">{content}</div>
    </div>
  ),
  {
    Provider: ({ children }: any) => <>{children}</>,
  }
);

export const Toaster = () => <div data-testid="toaster" />;

export const Accordion = ({
  children,
  type,
  defaultValue,
  collapsible,
  value,
  onValueChange,
}: any) => (
  <div
    data-testid="accordion"
    data-type={type}
    data-default={defaultValue}
    data-collapsible={collapsible}
    data-value={value}
  >
    {React.Children.map(children, (child) =>
      React.isValidElement(child)
        ? React.cloneElement(child as React.ReactElement, {
            openValue: value ?? defaultValue,
            onValueChange,
          } as React.Attributes)
        : child
    )}
  </div>
);

export const AccordionItem = ({
  children,
  value,
  className,
  openValue,
  onValueChange,
}: any) => (
  <div data-testid="accordion-item" data-value={value} className={className}>
    {React.Children.map(children, (child) =>
      React.isValidElement(child)
        ? React.cloneElement(child as React.ReactElement, {
            itemValue: value,
            openValue,
            onValueChange,
          } as React.Attributes)
        : child
    )}
  </div>
);

export const AccordionTrigger = ({
  children,
  itemValue,
  onValueChange,
  openValue,
}: any) => (
  <button
    type="button"
    data-testid="accordion-trigger"
    onClick={() =>
      onValueChange?.(openValue === itemValue ? '' : itemValue)
    }
  >
    {children}
  </button>
);

export const AccordionContent = ({ children, className }: any) => (
  <div data-testid="accordion-content" className={className}>
    {children}
  </div>
);

export const IconButton = ({ onClick, disabled, children, icon: IconComp }: any) => (
  <button type="button" onClick={onClick} disabled={disabled}>
    {IconComp ? <span data-testid="icon-button-icon" /> : null}
    {children}
  </button>
);

export const Menu = ({ children, trigger, items }: any) => (
  <div data-testid="menu">
    {trigger}
    {items?.map((item: { content: string; onAction?: () => void }, index: number) => (
      <button key={index} type="button" onClick={item.onAction}>
        {item.content}
      </button>
    ))}
    <div data-testid="menu-content">{children}</div>
  </div>
);

export const Drawer = ({ open, children }: any) =>
  open ? <div data-testid="drawer">{children}</div> : null;

export const DrawerContent = ({ children }: any) => <div>{children}</div>;
export const DrawerHeader = ({ children, className }: any) => (
  <div className={className}>{children}</div>
);
export const DrawerTitle = ({ children, className }: any) => (
  <div className={className}>{children}</div>
);
export const DrawerDescription = ({ children, className }: any) => (
  <div className={className}>{children}</div>
);
export const DrawerFooter = ({ children, className }: any) => (
  <div className={className}>{children}</div>
);
export const DrawerClose = ({ children, onClick, asChild }: any) => {
  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<{ onClick?: () => void }>;
    return React.cloneElement(child, {
      onClick: () => {
        child.props.onClick?.();
        onClick?.();
      },
    });
  }
  return (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  );
};

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

// Carousel components
export const Carousel = ({ children, className }: any) => (
  <div data-testid="carousel" className={className}>
    {children}
  </div>
);

export const CarouselContent = ({ children, className }: any) => (
  <div data-testid="carousel-content" className={className}>
    {children}
  </div>
);

export const CarouselItem = ({ children, className }: any) => (
  <div data-testid="carousel-item" className={className}>
    {children}
  </div>
);

export const CarouselNext = ({ ...props }: any) => (
  <button data-testid="carousel-next" {...props}>
    Next
  </button>
);

export const CarouselPrevious = ({ ...props }: any) => (
  <button data-testid="carousel-previous" {...props}>
    Previous
  </button>
);

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
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  BarChart,
  LineChart,
  AreaChart,
  PieChart,
  ScatterChart,
};
