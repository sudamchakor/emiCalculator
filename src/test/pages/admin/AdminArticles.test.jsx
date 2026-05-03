import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import AdminArticles from '../../../src/pages/admin/AdminArticles';
import '@testing-library/jest-dom';

// Mock react-router-dom's Link and useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Link: ({ to, children, ...props }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
  useNavigate: () => mockNavigate,
}));

// Mock useAuth hook
const mockUseAuth = jest.fn();
jest.mock('../../../src/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

// Mock Firebase Firestore
const mockCollection = jest.fn();
const mockGetDocs = jest.fn();
const mockDoc = jest.fn();
const mockDeleteDoc = jest.fn();
jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  collection: mockCollection,
  getDocs: mockGetDocs,
  doc: mockDoc,
  deleteDoc: mockDeleteDoc,
}));

// Mock ADMIN_UID
jest.mock('../../../src/utils/constants', () => ({
  ADMIN_UID: 'admin-uid-123',
}));

describe('AdminArticles Component', () => {
  const mockAdminUser = { uid: 'admin-uid-123', displayName: 'Admin User' };
  const mockNonAdminUser = { uid: 'non-admin-uid', displayName: 'Regular User' };

  const mockArticlesData = [
    {
      id: '1',
      title: 'Article One',
      category: 'Finance',
      authorName: 'Admin User',
      createdAt: { toDate: () => new Date('2023-01-01') },
      updatedAt: { toDate: () => new Date('2023-01-02') },
    },
    {
      id: '2',
      title: 'Article Two',
      category: 'Technology',
      authorName: 'Admin User',
      createdAt: { toDate: () => new Date('2023-02-01') },
      updatedAt: { toDate: () => new Date('2023-02-03') },
    },
  ];

  const renderComponent = (authLoading = false, user = mockAdminUser) => {
    mockUseAuth.mockReturnValue({ user, loading: authLoading });
    return render(
      <Router>
        <AdminArticles />
      </Router>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetDocs.mockResolvedValue({
      docs: mockArticlesData.map((article) => ({
        id: article.id,
        data: () => article,
      })),
    });
    mockDeleteDoc.mockResolvedValue();
    jest.spyOn(window, 'confirm').mockReturnValue(true); // Default to confirming deletion
    jest.spyOn(window, 'alert').mockImplementation(() => {}); // Mock alert
  });

  // --- Initial Loading and Error States ---
  it('shows loading spinner when authLoading is true', () => {
    renderComponent(true);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows loading spinner when articles are loading', () => {
    mockGetDocs.mockReturnValueOnce(new Promise(() => {})); // Never resolve
    renderComponent();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('displays error message if fetching articles fails', async () => {
    mockGetDocs.mockRejectedValueOnce(new Error('Failed to fetch'));
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText('Failed to load articles.')).toBeInTheDocument();
    });
  });

  // --- Admin View ---
  it('renders "Manage Articles" title and "Add New Article" button for admin', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText('Manage Articles')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Add New Article' })).toBeInTheDocument();
    });
  });

  it('renders a table with articles for admin', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByRole('table', { name: 'articles table' })).toBeInTheDocument();
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Category')).toBeInTheDocument();
      expect(screen.getByText('Author')).toBeInTheDocument();
      expect(screen.getByText('Created At')).toBeInTheDocument();
      expect(screen.getByText('Updated At')).toBeInTheDocument();
      expect(screen.getByText('Actions')).toBeInTheDocument();

      expect(screen.getByText('Article One')).toBeInTheDocument();
      expect(screen.getByText('Finance')).toBeInTheDocument();
      expect(screen.getByText('Admin User')).toBeInTheDocument();
      expect(screen.getByText('1/1/2023')).toBeInTheDocument();
      expect(screen.getByText('1/2/2023')).toBeInTheDocument();
    });
  });

  it('navigates to edit page when edit button is clicked', async () => {
    renderComponent();
    await waitFor(() => {
      fireEvent.click(screen.getAllByLabelText('edit')[0]);
      expect(mockNavigate).toHaveBeenCalledWith('/admin/articles/edit/1');
    });
  });

  it('deletes an article when delete button is clicked and confirmed', async () => {
    renderComponent();
    await waitFor(() => {
      fireEvent.click(screen.getAllByLabelText('delete')[0]);
      expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this article?');
      expect(mockDeleteDoc).toHaveBeenCalledWith(expect.any(Object), 'articles', '1');
      expect(window.alert).toHaveBeenCalledWith('Article deleted successfully!');
      expect(screen.queryByText('Article One')).not.toBeInTheDocument(); // Article removed from list
    });
  });

  it('does not delete an article if confirmation is cancelled', async () => {
    window.confirm.mockReturnValue(false); // User cancels
    renderComponent();
    await waitFor(() => {
      fireEvent.click(screen.getAllByLabelText('delete')[0]);
      expect(window.confirm).toHaveBeenCalledTimes(1);
      expect(mockDeleteDoc).not.toHaveBeenCalled();
      expect(window.alert).not.toHaveBeenCalled();
      expect(screen.getByText('Article One')).toBeInTheDocument(); // Article still in list
    });
  });

  it('shows alert if article deletion fails', async () => {
    mockDeleteDoc.mockRejectedValueOnce(new Error('Delete failed'));
    renderComponent();
    await waitFor(() => {
      fireEvent.click(screen.getAllByLabelText('delete')[0]);
      expect(window.alert).toHaveBeenCalledWith('Failed to delete article.');
    });
  });

  it('formats Firestore Timestamp objects correctly', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText('1/1/2023')).toBeInTheDocument();
      expect(screen.getByText('1/2/2023')).toBeInTheDocument();
    });
  });

  it('formats string dates correctly', async () => {
    mockGetDocs.mockResolvedValueOnce({
      docs: [{
        id: '3',
        data: () => ({
          id: '3',
          title: 'Article Three',
          category: 'Finance',
          authorName: 'Admin User',
          createdAt: '2023-03-01T00:00:00Z',
          updatedAt: '2023-03-02T00:00:00Z',
        }),
      }],
    });
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText('3/1/2023')).toBeInTheDocument();
      expect(screen.getByText('3/2/2023')).toBeInTheDocument();
    });
  });

  // --- Non-Admin View ---
  it('does not show "Add New Article" button for non-admin users', async () => {
    renderComponent(false, mockNonAdminUser);
    await waitFor(() => {
      expect(screen.queryByRole('link', { name: 'Add New Article' })).not.toBeInTheDocument();
    });
  });

  it('does not show "Actions" column for non-admin users', async () => {
    renderComponent(false, mockNonAdminUser);
    await waitFor(() => {
      expect(screen.queryByText('Actions')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('edit')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('delete')).not.toBeInTheDocument();
    });
  });

  // --- Empty State ---
  it('displays "No articles found." when there are no articles', async () => {
    mockGetDocs.mockResolvedValueOnce({ docs: [] }); // No articles
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText('No articles found.')).toBeInTheDocument();
      expect(screen.queryByRole('table')).not.toBeInTheDocument();
    });
  });
});