CREATE UNIQUE INDEX workspace_sort_order_contraint
    ON tasks (workspace_id, status_id, sort_order)
    WHERE deleted_at IS NULL;
