/*
  # Create DRN and UCM Status Tables

  1. New Tables
    - `drn_status`
      - `id` (uuid, primary key) - Unique identifier
      - `document_title` (text) - Title of the document
      - `outstanding_numbers` (integer) - Count of outstanding items
      - `deadline_date` (date) - Deadline for completion
      - `status` (text) - Current status
      - `comments_raised` (integer) - Number of comments raised
      - `comment_rejected` (integer) - Number of comments rejected
      - `notes_comments` (text) - Additional notes or comments
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Record update timestamp
    
    - `ucm_status`
      - `id` (uuid, primary key) - Unique identifier
      - `document_id` (text) - Document reference ID
      - `title` (text) - Document title
      - `deadline_date` (date) - Deadline for completion
      - `owner` (text) - Document owner
      - `status` (text) - Current status
      - `reviewer` (text) - Assigned reviewer
      - `reviewer_status` (text) - Reviewer's status
      - `approver` (text) - Assigned approver
      - `approver_status` (text) - Approver's status
      - `external` (boolean) - Whether external or not
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Record update timestamp

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to perform all CRUD operations
*/

CREATE TABLE IF NOT EXISTS drn_status (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_title text NOT NULL,
  outstanding_numbers integer DEFAULT 0,
  deadline_date date,
  status text DEFAULT 'Pending',
  comments_raised integer DEFAULT 0,
  comment_rejected integer DEFAULT 0,
  notes_comments text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ucm_status (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id text NOT NULL,
  title text NOT NULL,
  deadline_date date,
  owner text DEFAULT '',
  status text DEFAULT 'Pending',
  reviewer text DEFAULT '',
  reviewer_status text DEFAULT 'Not Started',
  approver text DEFAULT '',
  approver_status text DEFAULT 'Not Started',
  external boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE drn_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE ucm_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations for authenticated users on drn_status"
  ON drn_status
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations for authenticated users on ucm_status"
  ON ucm_status
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations for anonymous users on drn_status"
  ON drn_status
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations for anonymous users on ucm_status"
  ON ucm_status
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);