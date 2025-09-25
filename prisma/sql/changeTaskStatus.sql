WITH max_sort_order AS (
    SELECT MAX(sort_order) as max_value
    FROM tasks
    WHERE tasks.workspace_id = $2 and status_id = $3
)

UPDATE tasks
SET sort_order = (
    SELECT
        CASE 
            WHEN max_value IS NULL THEN 0.0
            ELSE max_value + 1000
        END
    FROM max_sort_order
),
    status_id = $3
WHERE id = $1
