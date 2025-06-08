# Testing Plan - Critical User Paths

## Overview

This testing plan focuses on the most critical user workflows in the drag-and-drop todo application. The app features a kanban-style board with columns and todos that can be dragged, reordered, and manipulated.

## 🎯 Critical User Paths to Test

### 1. Column Management

**Priority: HIGH** - Core functionality for organizing todos

#### 1.1 Column Creation

- **Test**: User can create a new column
- **Steps**: Click "Create Column" button → Column appears with "New Column" title → User can edit title
- **Expected**: New column is added to the board with editable title
- **Test File**: `tests/column-management.test.tsx`

#### 1.2 Column Title Editing

- **Test**: User can rename column titles
- **Steps**: Click column title → Input field appears → Enter new title → Save
- **Expected**: Column title updates and persists
- **Edge Cases**: Empty titles, very long titles, special characters

#### 1.3 Column Deletion

- **Test**: User can delete columns
- **Steps**: Use delete button on column → Column and all todos are removed
- **Expected**: Column disappears from board, todos are deleted
- **Edge Cases**: Deleting column with todos, last remaining column

#### 1.4 Column Drag & Drop Reordering

- **Test**: User can reorder columns by dragging
- **Steps**: Drag column header → Drop in new position → Column reorders
- **Expected**: Columns maintain new order, todos stay with their columns
- **Test File**: `tests/column-drag-drop.test.tsx`

### 2. Todo Management

**Priority: HIGH** - Primary user interaction

#### 2.1 Todo Creation

- **Test**: User can add new todos to columns
- **Steps**: Click "Add todo" button → New todo appears → User can edit title
- **Expected**: New todo is added with "New Todo" title and editable state
- **Test File**: `tests/todo-management.test.tsx`

#### 2.2 Todo Title Editing

- **Test**: User can edit todo titles
- **Steps**: Click todo title → Input field appears → Enter new title → Save
- **Expected**: Todo title updates and persists
- **Edge Cases**: Empty titles, very long titles

#### 2.3 Todo Status Toggle (Complete/Incomplete)

- **Test**: User can mark todos as finished/unfinished
- **Steps**: Click check icon → Todo status toggles → Visual state changes
- **Expected**: Todo completion state changes, visual feedback provided

#### 2.4 Todo Deletion

- **Test**: User can delete individual todos
- **Steps**: Click delete (bin) icon → Todo is removed
- **Expected**: Todo disappears from column

#### 2.5 Todo Selection (Individual)

- **Test**: User can select/deselect individual todos
- **Steps**: Click checkbox → Todo becomes selected → Visual feedback
- **Expected**: Todo selection state toggles, visual indication provided

### 3. Drag & Drop Operations

**Priority: CRITICAL** - Core application feature

#### 3.1 Todo Reordering Within Column

- **Test**: User can reorder todos within the same column
- **Steps**: Drag todo → Drop in new position within same column → Order changes
- **Expected**: Todo moves to new position, other todos adjust accordingly
- **Test File**: `tests/todo-drag-drop.test.tsx`

#### 3.2 Todo Movement Between Columns

- **Test**: User can move todos between different columns
- **Steps**: Drag todo from one column → Drop in another column → Todo moves
- **Expected**: Todo appears in target column, removed from source column

#### 3.3 Todo Drop on Empty Column

- **Test**: User can drop todos on empty columns
- **Steps**: Drag todo → Drop on empty column area → Todo appears
- **Expected**: Todo is added to empty column

#### 3.4 Drag Overlay Rendering

- **Test**: Visual feedback during drag operations
- **Steps**: Start dragging todo/column → Overlay appears → Drop → Overlay disappears
- **Expected**: Proper drag preview shown, smooth visual feedback

### 4. Search and Filter Functionality

**Priority: MEDIUM** - Important for usability

#### 4.1 Search Todos

- **Test**: User can search for todos by title
- **Steps**: Type in search box → Results filter in real-time → Clear search
- **Expected**: Only matching todos shown, highlighting applied, debounced input
- **Test File**: `tests/search-filter.test.tsx`

#### 4.2 Filter by Status

- **Test**: User can filter todos by completion status
- **Steps**: Select filter (All/Finished/Unfinished) → View updates
- **Expected**: Only todos matching filter criteria are displayed

#### 4.3 Combined Search and Filter

- **Test**: Search and filter work together
- **Steps**: Apply search term + status filter → Results show intersection
- **Expected**: Todos matching both criteria are displayed

### 5. Batch Operations

**Priority: MEDIUM** - Efficiency features

#### 5.1 Select All in Column

- **Test**: User can select all todos in a column
- **Steps**: Click "Select all" button → All todos in column become selected
- **Expected**: All todos in that column are selected
- **Test File**: `tests/batch-operations.test.tsx`

#### 5.2 Bulk Delete Selected Todos

- **Test**: User can delete multiple selected todos
- **Steps**: Select multiple todos → Click "Delete" button → Todos are removed
- **Expected**: All selected todos are deleted from their respective columns

#### 5.3 Bulk Status Change

- **Test**: User can mark multiple todos as done/undone
- **Steps**: Select multiple todos → Click "Mark Done"/"Mark Undone" → Status changes
- **Expected**: All selected todos change to specified status, selection clears

#### 5.4 Bulk Move Selected Todos

- **Test**: User can move multiple selected todos to another column
- **Steps**: Select multiple todos → Use "Move To" dropdown → Select target column
- **Expected**: All selected todos move to target column

### 6. Data Persistence

**Priority: HIGH** - Critical for user experience

#### 6.1 LocalStorage Persistence

- **Test**: Data persists across browser sessions
- **Steps**: Create columns/todos → Refresh page → Data remains
- **Expected**: All columns, todos, and their states are restored
- **Test File**: `tests/data-persistence.test.tsx`

#### 6.2 State Consistency

- **Test**: Application state remains consistent during operations
- **Steps**: Perform multiple operations → Check data integrity
- **Expected**: No data corruption, relationships maintained

## 🧪 Testing Implementation Strategy

### Test File Organization

```
src/
  __tests__/
    integration/
      column-management.test.tsx
      todo-management.test.tsx
      todo-drag-drop.test.tsx
      column-drag-drop.test.tsx
      search-filter.test.tsx
      batch-operations.test.tsx
      data-persistence.test.tsx
    unit/
      hooks/
        useColumns.test.ts
        useTodos.test.ts
        useFilter.test.ts
        useSelected.test.ts
      components/
        TodoCard.test.tsx
        Column.test.tsx
        SearchAndFilterBar.test.tsx
    e2e/
      critical-user-flows.spec.ts
```

### Testing Tools & Setup

- **Unit/Integration**: Vitest + React Testing Library (already configured)
- **Drag & Drop**: `@testing-library/user-event` with custom drag helpers
- **E2E**: Playwright for critical flows
- **Mocking**: LocalStorage, timers for debounced operations

### Test Data Strategy

- Use factory functions for creating test todos/columns
- Mock localStorage operations
- Create reusable test utilities for drag operations
- Use data-testid attributes (already present in code)

### Key Test Utilities Needed

1. **DragTestHelper**: Utility for simulating drag operations
2. **TodoFactory**: Generate test todo objects
3. **ColumnFactory**: Generate test column objects
4. **LocalStorageMock**: Mock localStorage for tests
5. **ThemeTestProvider**: Wrapper for theme-related tests

## 🚀 Implementation Priority

1. **Phase 1**: Todo and Column CRUD operations (High Priority)
2. **Phase 2**: Drag & Drop functionality (Critical Priority)
3. **Phase 3**: Search/Filter and Batch operations (Medium Priority)
4. **Phase 4**: Persistence and Theme features (Low-Medium Priority)
5. **Phase 5**: E2E critical user flows

## 📊 Success Criteria

- ✅ All critical user paths have test coverage
- ✅ Drag & drop operations work reliably across browsers
- ✅ Data persistence works correctly
- ✅ No regression in core functionality
- ✅ Tests run in CI/CD pipeline
- ✅ Test coverage > 80% for critical components

## 🔧 Special Testing Considerations

### Drag & Drop Testing Challenges

- DnD kit requires special testing setup
- Need to mock pointer/touch events
- Test drag previews and drop zones
- Verify collision detection works correctly

### Async Operations

- Debounced search input (150ms delay)
- LocalStorage async operations
- Theme system initialization

### State Management

- Context state consistency
- Immutability helpers working correctly
- Filter/search state coordination

### Browser Compatibility

- Touch vs mouse events
- LocalStorage availability
- CSS custom properties (theme system)
