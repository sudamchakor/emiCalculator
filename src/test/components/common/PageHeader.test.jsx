import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme, alpha } from '@mui/material/styles';
import PageHeader from '../../../src/components/common/PageHeader';
import { Home as HomeIcon } from '@mui/icons-material'; // Example icon
import '@testing-library/jest-dom';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
    text: { primary: '#000000', secondary: '#555555' },
    divider: '#cccccc',
  },
});

describe('PageHeader Component', () => {
  // Helper function to render the component with ThemeProvider
  const renderComponent = (props) => {
    return render(
      <ThemeProvider theme={theme}>
        <PageHeader {...props} />
      </ThemeProvider>
    );
  };

  // --- Positive Scenarios ---
  it('renders with a title only', () => {
    renderComponent({ title: 'Test Title' });
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.queryByText('Test Subtitle')).not.toBeInTheDocument();
    expect(screen.queryByTestId('home-icon')).not.toBeInTheDocument();
    expect(screen.queryByTestId('action-element')).not.toBeInTheDocument();
  });

  it('renders with a title and subtitle', () => {
    renderComponent({ title: 'Test Title', subtitle: 'Test Subtitle' });
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
  });

  it('renders with a title and icon', () => {
    renderComponent({ title: 'Test Title', icon: HomeIcon });
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByTestId('HomeIcon')).toBeInTheDocument();
    // Check default icon color (primary)
    const iconWrapper = screen.getByTestId('HomeIcon').closest('.MuiBox-root');
    expect(iconWrapper).toHaveStyle(`background-color: ${alpha(theme.palette.primary.main, 0.1)}`);
    expect(iconWrapper).toHaveStyle(`color: ${theme.palette.primary.main}`);
  });

  it('renders with a title, icon, and custom iconColor', () => {
    renderComponent({ title: 'Test Title', icon: HomeIcon, iconColor: 'secondary' });
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByTestId('HomeIcon')).toBeInTheDocument();
    // Check custom icon color (secondary)
    const iconWrapper = screen.getByTestId('HomeIcon').closest('.MuiBox-root');
    expect(iconWrapper).toHaveStyle(`background-color: ${alpha(theme.palette.secondary.main, 0.1)}`);
    expect(iconWrapper).toHaveStyle(`color: ${theme.palette.secondary.main}`);
  });

  it('renders with a title and action element', () => {
    renderComponent({ title: 'Test Title', action: <button data-testid="action-element">Action</button> });
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByTestId('action-element')).toBeInTheDocument();
    // Check alignment when action is present
    const stack = screen.getByText('Test Title').closest('.MuiStack-root');
    expect(stack).toHaveStyle('align-items: flex-end');
  });

  it('renders with title, subtitle, icon, and action', () => {
    renderComponent({
      title: 'Full Header',
      subtitle: 'Comprehensive Test',
      icon: HomeIcon,
      iconColor: 'primary',
      action: <span data-testid="action-element">Full Action</span>,
    });
    expect(screen.getByText('Full Header')).toBeInTheDocument();
    expect(screen.getByText('Comprehensive Test')).toBeInTheDocument();
    expect(screen.getByTestId('HomeIcon')).toBeInTheDocument();
    expect(screen.getByTestId('action-element')).toBeInTheDocument();
  });

  // --- Negative Scenarios / Edge Cases ---
  it('renders with an empty title string', () => {
    renderComponent({ title: '' });
    expect(screen.getByText('')).toBeInTheDocument(); // Empty typography element
  });

  it('renders with an empty subtitle string', () => {
    renderComponent({ title: 'Title', subtitle: '' });
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.queryByText('Test Subtitle')).not.toBeInTheDocument(); // Ensure no default text
  });

  it('does not render icon box if icon prop is not provided', () => {
    renderComponent({ title: 'No Icon' });
    expect(screen.queryByTestId('HomeIcon')).not.toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument(); // No SVG icon
  });

  it('does not render action box if action prop is not provided', () => {
    renderComponent({ title: 'No Action' });
    expect(screen.queryByTestId('action-element')).not.toBeInTheDocument();
  });

  it('aligns items to center when no action is provided', () => {
    renderComponent({ title: 'No Action' });
    const stack = screen.getByText('No Action').closest('.MuiStack-root');
    expect(stack).toHaveStyle('align-items: center');
  });
});