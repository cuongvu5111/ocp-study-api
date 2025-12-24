-- Insert 5 quiz questions với options

-- Question 1: Functional Interface
INSERT INTO questions (topic_id, content, code_snippet, question_type, difficulty, explanation)
VALUES (4, 'Functional Interface là gì trong Java?', NULL, 'SINGLE_CHOICE', 1, 'Functional Interface chỉ có duy nhất 1 abstract method và được đánh dấu @FunctionalInterface.');

INSERT INTO question_options (question_id, option_key, content, is_correct)
VALUES 
  ((SELECT MAX(id) FROM questions), 'A', 'Interface có nhiều abstract methods', false),
  ((SELECT MAX(id) FROM questions), 'B', 'Interface chỉ có duy nhất 1 abstract method', true),
  ((SELECT MAX(id) FROM questions), 'C', 'Interface không có method nào', false),
  ((SELECT MAX(id) FROM questions), 'D', 'Interface chỉ có static methods', false);

-- Question 2: Stream Output
INSERT INTO questions (topic_id, content, code_snippet, question_type, difficulty, explanation)
VALUES (4, 'Đoạn code sau sẽ output gì?', 
'List<Integer> nums = Arrays.asList(1, 2, 3);
nums.stream()
    .filter(n -> n > 1)
    .forEach(System.out::println);', 
'SINGLE_CHOICE', 2, 'Stream filter chỉ giữ lại các phần tử thỏa điều kiện n > 1, tức là 2 và 3.');

INSERT INTO question_options (question_id, option_key, content, is_correct)
VALUES 
  ((SELECT MAX(id) FROM questions), 'A', '1 2 3', false),
  ((SELECT MAX(id) FROM questions), 'B', '2 3', true),
  ((SELECT MAX(id) FROM questions), 'C', '1', false),
  ((SELECT MAX(id) FROM questions), 'D', 'Compilation error', false);

-- Question 3: Checked Exception
INSERT INTO questions (topic_id, content, code_snippet, question_type, difficulty, explanation)
VALUES (3, 'Checked Exception nào KHÔNG cần khai báo trong throws clause?', NULL, 'SINGLE_CHOICE', 2, 
'RuntimeException và subclasses là unchecked exceptions, không cần khai báo trong throws clause.');

INSERT INTO question_options (question_id, option_key, content, is_correct)
VALUES 
  ((SELECT MAX(id) FROM questions), 'A', 'IOException', false),
  ((SELECT MAX(id) FROM questions), 'B', 'SQLException', false),
  ((SELECT MAX(id) FROM questions), 'C', 'RuntimeException', true),
  ((SELECT MAX(id) FROM questions), 'D', 'FileNotFoundException', false);

-- Question 4: HashMap vs TreeMap
INSERT INTO questions (topic_id, content, code_snippet, question_type, difficulty, explanation)
VALUES (6, 'HashMap vs TreeMap, cái nào có lookup time O(log n)?', NULL, 'SINGLE_CHOICE', 1, 
'TreeMap sử dụng Red-Black tree nên lookup time là O(log n). HashMap dùng hash table nên là O(1).');

INSERT INTO question_options (question_id, option_key, content, is_correct)
VALUES 
  ((SELECT MAX(id) FROM questions), 'A', 'HashMap', false),
  ((SELECT MAX(id) FROM questions), 'B', 'TreeMap', true),
  ((SELECT MAX(id) FROM questions), 'C', 'Cả hai', false),
  ((SELECT MAX(id) FROM questions), 'D', 'Không cái nào', false);

-- Question 5: Concurrency volatile
INSERT INTO questions (topic_id, content, code_snippet, question_type, difficulty, explanation)
VALUES (8, 'Keyword nào đảm bảo visibility giữa các threads?', NULL, 'SINGLE_CHOICE', 3, 
'Volatile keyword đảm bảo mọi thread đều thấy giá trị mới nhất của biến (visibility guarantee).');

INSERT INTO question_options (question_id, option_key, content, is_correct)
VALUES 
  ((SELECT MAX(id) FROM questions), 'A', 'static', false),
  ((SELECT MAX(id) FROM questions), 'B', 'final', false),
  ((SELECT MAX(id) FROM questions), 'C', 'volatile', true),
  ((SELECT MAX(id) FROM questions), 'D', 'transient', false);
