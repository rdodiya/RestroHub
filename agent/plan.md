1.  **Frontend: Create BranchContext**
    *   I've already created `BranchContext.jsx` in `RestroHub-FrontEnd/src/context/` via bash.
2.  **Frontend: Admin Header Branch Switcher (`@Todo-2`)**
    *   Update `AdminLayout.jsx` using `replace_with_git_merge_diff` to wrap the outlet with `<BranchProvider>`.
    *   Update `Header.jsx` using `replace_with_git_merge_diff` to consume `useBranch` and add a branch selector dropdown.
    *   Verify the changes using `run_in_bash_session` to check file contents with `cat RestroHub-FrontEnd/src/layouts/AdminLayout.jsx` and `cat RestroHub-FrontEnd/src/components/admin/Header.jsx`.
3.  **Backend: Dashboard Analytics Wiring (`@Todo-4`) - Backend Changes**
    *   Update `DashboardController.java` using `replace_with_git_merge_diff` to accept `@PathVariable Long branchId` for `/statistics/{branchId}`.
    *   Update `DashboardService.java` and `DashboardServiceImpl.java` using `replace_with_git_merge_diff` to accept `branchId` for `getDashboardStats`.
    *   Update `OrderRepository.java` using `replace_with_git_merge_diff` to add `long countByBranchBranchIdAndStatusIn(Long branchId, List<OrderStatus> statuses);` and update revenue method to `@Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.branch.branchId = :branchId AND o.createdAt BETWEEN :start AND :end") BigDecimal getTodayRevenueByBranch(@Param("branchId") Long branchId, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);`.
    *   Verify by compiling backend using `run_in_bash_session` with `cd RestroHub && ./gradlew build -x test`.
4.  **Frontend: Dashboard Analytics Wiring (`@Todo-4`) - Frontend Changes**
    *   Update `StatsSection.jsx` using `replace_with_git_merge_diff` to fetch from `/statistics/${selectedBranchId}` using `selectedBranchId` from context.
    *   Update `RevenueChart.jsx` and `QuickActions.jsx` using `replace_with_git_merge_diff` to use `selectedBranchId` from context instead of `getBranchId`.
    *   Verify frontend builds without errors using `run_in_bash_session` with `cd RestroHub-FrontEnd && npm run build`.
5.  **Backend: Order History API & Filters (`@Todo-3`) - Backend Changes**
    *   Update `OrderController.java` using `replace_with_git_merge_diff` to add `@GetMapping("/history") public ResponseEntity<Page<OrderResponse>> getOrderHistory(@RequestParam Long branchId, @RequestParam(required = false) String startDate, @RequestParam(required = false) String endDate, @RequestParam(required = false) OrderStatus status, @RequestParam(required = false) String phone, Pageable pageable)`.
    *   Update `OrderService.java` using `replace_with_git_merge_diff` to add `Page<OrderResponse> getOrderHistory(Long branchId, String startDate, String endDate, OrderStatus status, String phone, Pageable pageable);`.
    *   Update `OrderServiceImpl.java` using `replace_with_git_merge_diff` to implement `getOrderHistory`. It will use `orderRepository.findAll(Specification, Pageable)` and map the resulting `Page<Order>` to `Page<OrderResponse>`.
    *   Update `OrderRepository.java` using `replace_with_git_merge_diff` to extend `JpaSpecificationExecutor<Order>`.
    *   Verify backend compilation using `run_in_bash_session` with `cd RestroHub && ./gradlew build -x test`.
6.  **Frontend: Order History API & Filters (`@Todo-3`) - Frontend Changes**
    *   Create `OrderHistoryModal.jsx` using `write_file`. The component will accept `isOpen`, `onClose`, and `branchId` as props. It will manage state for `orders` (array), `loading` (boolean), `page` (number), `totalPages` (number), and filter state (`startDate`, `endDate`, `status`, `phone`). It will use a `useEffect` hooked to these states to fetch from `/secure/api/v1/orders/history?branchId=...&page=...` using `api.get`. It will render a table with columns for Order ID, Date, Table, Customer, Status, and Total, along with pagination controls.
    *   Verify file creation using `run_in_bash_session` with `cat RestroHub-FrontEnd/src/components/admin/orders/OrderHistoryModal.jsx`.
    *   Update `Orders.jsx` using `replace_with_git_merge_diff` to import and render `OrderHistoryModal` when a new "Order History" button is clicked.
    *   Verify frontend builds using `run_in_bash_session` with `cd RestroHub-FrontEnd && npm run build`.
7.  **Frontend: Free Tier Marketing Template Limiter (`@Todo-5`)**
    *   Update `TemplateSelector.jsx` using `replace_with_git_merge_diff`. Fetch subscription details via `api.get('/secure/api/v1/users/fetchRestaurantId')` to get `restaurantId` then `api.get('/secure/api/v1/restaurant/'+restaurantId+'/subscription')`. Check if `plan.name` contains "Free" from the `RestaurantSubscriptionDto` response. Modify the rendering loop for `templates`: if "Free" plan, and template `id` is not "modern" and not "classic", add a visual overlay/badge with text like "Upgrade to Pro", and conditionally replace `onClick={() => onTemplateChange(template.id)}` with `onClick={(e) => { e.preventDefault(); toast.error("Upgrade to Pro to unlock"); }}` and styling to look disabled.
    *   Verify `TemplateSelector.jsx` changes using `run_in_bash_session` with `cat RestroHub-FrontEnd/src/components/admin/marketing/website/TemplateSelector.jsx`.
8.  **Backend: Dynamic Subdomain Resolution (`@Todo-1`)**
    *   Update `PublicSiteController.java` using `replace_with_git_merge_diff`. Modify the `@GetMapping("/{siteId}/config")` method signature to add `HttpServletRequest request`. If `siteId` equals "resolve" or is missing (handle this with logic inside method), extract the subdomain from `request.getServerName()` (e.g., `String host = request.getServerName(); String extractedSiteId = host.split("\\.")[0];`) and use it to fetch config.
    *   Verify compilation using `run_in_bash_session` with `cd RestroHub && ./gradlew build -x test`.
9.  **Backend: Granular Role Enforcement (`@Todo-6`)**
    *   Update `DashboardController.java` using `replace_with_git_merge_diff` to add `@PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")` to restrict `STAFF`.
    *   Update `OrderController.java` using `replace_with_git_merge_diff`. Add `@PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'STAFF')")` for read access, and `@PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'STAFF')")` for status updates.
    *   Verify compilation using `run_in_bash_session` with `cd RestroHub && ./gradlew build -x test`.
10. **Frontend: Counter QR Code Generation (`table_number = 0`)**
    *   Update `Tables.jsx` using `replace_with_git_merge_diff`. Pass an `onGenerateCounterQR={() => { setSelectedTable({ id: 0, number: '0' }); setShowQR(true); }}` prop to `TablesHeader`.
    *   Update `TablesHeader.jsx` using `replace_with_git_merge_diff`. Add a button "Generate Counter QR" that calls `onGenerateCounterQR`.
    *   Update `TableQRModal.jsx` using `replace_with_git_merge_diff`. Modify the `qrUrl` string generation to cleanly support `table.number === '0'`, potentially using `?tableNumber=0` to match how the frontend reads it.
    *   Verify UI change via frontend build using `run_in_bash_session` with `cd RestroHub-FrontEnd && npm run build`.
11. **Run tests**
    *   Run tests using `run_in_bash_session` (`cd RestroHub && ./gradlew test`) to ensure correctness and no regressions.
12. **Complete pre-commit steps**
    *   Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.
13. **Submit**
    *   Submit the branch.
