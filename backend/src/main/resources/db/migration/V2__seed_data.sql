-- Flyway Migration: Seed Initial Data  
-- Version: V2
-- Description: Seed certifications, topics, subtopics cho ứng dụng OCP Study

SET CLIENT_ENCODING TO 'UTF8';

-- =====================================================
-- CERTIFICATIONS
-- =====================================================

-- OCP Java SE 11 (default certification)
INSERT INTO certifications (name, code, description, icon, duration_months)
VALUES ('Oracle Certified Professional: Java SE 11 Developer', 'OCP-11', 
        'Validate your Java programming skills with the OCP Java SE 11 certification.', 
        'coffee', 6);

-- AWS Solutions Architect
INSERT INTO certifications (name, code, description, icon)
VALUES ('AWS Certified Solutions Architect - Associate', 'SAA-C03', 
        'Validate your ability to design and deploy well-architected solutions on AWS.', 
        'cloud');

-- Azure Administrator
INSERT INTO certifications (name, code, description, icon)
VALUES ('Azure Administrator Associate', 'AZ-104', 
        'Manage cloud services that span storage, security, networking, and compute cloud capabilities.', 
        'window');

-- IELTS Academic
INSERT INTO certifications (name, code, description, icon)
VALUES ('IELTS Academic', 'IELTS-AC', 
        'The test for people applying for higher education or professional registration.', 
        'school');

-- Kubernetes CKA
INSERT INTO certifications (name, code, description, icon)
VALUES ('Certified Kubernetes Administrator', 'CKA', 
        'Certification for Kubernetes administrators.', 
        'anchor');

-- =====================================================
-- OCP JAVA SE 11 - TOPICS & SUBTOPICS
-- Sử dụng subquery để lấy certification_id và topic_id
-- =====================================================

-- TOPIC 1: Working with Java Data Types (Tháng 1)
INSERT INTO topics (certification_id, name, description, icon, month, order_index, estimated_days)
SELECT id, 'Working with Java Data Types', 
       'Primitives, wrapper classes, operators, String, StringBuilder, và var keyword', 
       '📘', 1, 1, 8
FROM certifications WHERE code = 'OCP-11';

INSERT INTO subtopics (topic_id, name, description, difficulty, estimated_days, priority, order_index)
SELECT t.id, s.name, s.description, s.difficulty, s.estimated_days, s.priority, s.order_index
FROM topics t, (VALUES
    ('Primitives và Wrapper Classes', 'int/Integer, double/Double, autoboxing, unboxing', 2, 2, 'HIGH', 1),
    ('Operators, Promotion, Casting', 'Numeric promotion, type casting, operator precedence', 3, 3, 'HIGH', 2),
    ('String và StringBuilder', 'Immutability, String pool, StringBuilder methods', 2, 2, 'HIGH', 3),
    ('Local Variable Type Inference (var)', 'Sử dụng var trong lambda, restrictions', 2, 1, 'MEDIUM', 4)
) AS s(name, description, difficulty, estimated_days, priority, order_index)
WHERE t.name = 'Working with Java Data Types';

-- TOPIC 2: Controlling Program Flow (Tháng 1)
INSERT INTO topics (certification_id, name, description, icon, month, order_index, estimated_days)
SELECT id, 'Controlling Program Flow', 
       'If/else, switch, loops, break, continue statements', 
       '📘', 1, 2, 3
FROM certifications WHERE code = 'OCP-11';

INSERT INTO subtopics (topic_id, name, description, difficulty, estimated_days, priority, order_index)
SELECT t.id, s.name, s.description, s.difficulty, s.estimated_days, s.priority, s.order_index
FROM topics t, (VALUES
    ('if/else, switch statements', 'Conditional logic, switch expressions', 1, 1, 'MEDIUM', 1),
    ('Loops (for, while, do-while)', 'Loop constructs, enhanced for loop', 1, 1, 'MEDIUM', 2),
    ('break, continue, labels', 'Flow control statements, labeled loops', 2, 1, 'HIGH', 3)
) AS s(name, description, difficulty, estimated_days, priority, order_index)
WHERE t.name = 'Controlling Program Flow';

-- TOPIC 3: Java Object-Oriented Approach (Tháng 2)
INSERT INTO topics (certification_id, name, description, icon, month, order_index, estimated_days)
SELECT id, 'Java Object-Oriented Approach', 
       'Classes, objects, inheritance, polymorphism, interfaces, nested classes', 
       '📗', 2, 3, 20
FROM certifications WHERE code = 'OCP-11';

INSERT INTO subtopics (topic_id, name, description, difficulty, estimated_days, priority, order_index)
SELECT t.id, s.name, s.description, s.difficulty, s.estimated_days, s.priority, s.order_index
FROM topics t, (VALUES
    ('Classes, Objects, Constructors', 'Object lifecycle, constructor chaining, this keyword', 2, 3, 'HIGH', 1),
    ('Inheritance, Polymorphism', 'extends, super, method overriding, instanceof', 3, 4, 'CRITICAL', 2),
    ('Abstract Classes vs Interfaces', 'Abstract methods, default/static interface methods', 3, 3, 'CRITICAL', 3),
    ('Encapsulation, Immutability', 'Access modifiers, immutable objects, defensive copying', 2, 2, 'HIGH', 4),
    ('Nested Classes', 'Inner, Static, Local, Anonymous classes', 3, 3, 'HIGH', 5),
    ('Enumerations', 'Enum methods, constructors, abstract methods in enums', 2, 2, 'MEDIUM', 6),
    ('Functional Interfaces', '@FunctionalInterface, SAM, built-in functional interfaces', 3, 3, 'CRITICAL', 7)
) AS s(name, description, difficulty, estimated_days, priority, order_index)
WHERE t.name = 'Java Object-Oriented Approach';

-- TOPIC 4: Exception Handling (Tháng 3)
INSERT INTO topics (certification_id, name, description, icon, month, order_index, estimated_days)
SELECT id, 'Exception Handling', 
       'Try/catch, try-with-resources, custom exceptions, assertions', 
       '📙', 3, 4, 7
FROM certifications WHERE code = 'OCP-11';

INSERT INTO subtopics (topic_id, name, description, difficulty, estimated_days, priority, order_index)
SELECT t.id, s.name, s.description, s.difficulty, s.estimated_days, s.priority, s.order_index
FROM topics t, (VALUES
    ('try/catch/finally', 'Exception hierarchy, checked vs unchecked', 2, 2, 'HIGH', 1),
    ('try-with-resources', 'AutoCloseable, suppressed exceptions', 3, 2, 'CRITICAL', 2),
    ('Multi-catch', 'Catching multiple exceptions, exception chaining', 2, 1, 'HIGH', 3),
    ('Custom Exceptions', 'Creating custom checked/unchecked exceptions', 2, 1, 'MEDIUM', 4),
    ('Assertions', 'assert statement, enabling assertions', 1, 1, 'LOW', 5)
) AS s(name, description, difficulty, estimated_days, priority, order_index)
WHERE t.name = 'Exception Handling';

-- TOPIC 5: Arrays and Collections (Tháng 3)
INSERT INTO topics (certification_id, name, description, icon, month, order_index, estimated_days)
SELECT id, 'Arrays and Collections', 
       'Arrays, List, Set, Map, Deque, Generics, Comparator', 
       '📙', 3, 5, 13
FROM certifications WHERE code = 'OCP-11';

INSERT INTO subtopics (topic_id, name, description, difficulty, estimated_days, priority, order_index)
SELECT t.id, s.name, s.description, s.difficulty, s.estimated_days, s.priority, s.order_index
FROM topics t, (VALUES
    ('Arrays', 'Array creation, manipulation, Arrays utility class', 2, 2, 'HIGH', 1),
    ('List, Set, Map, Deque', 'ArrayList, HashSet, HashMap, ArrayDeque, LinkedList', 3, 4, 'CRITICAL', 2),
    ('Generics & Wildcards', 'Generic types, bounds, wildcards (?, extends, super)', 4, 4, 'CRITICAL', 3),
    ('Comparator & Comparable', 'Natural ordering, custom comparators, chained comparators', 3, 2, 'HIGH', 4),
    ('Collection Convenience Methods', 'List.of(), Set.of(), Map.of(), copyOf()', 2, 1, 'MEDIUM', 5)
) AS s(name, description, difficulty, estimated_days, priority, order_index)
WHERE t.name = 'Arrays and Collections';

-- TOPIC 6: Lambda Expressions & Streams (Tháng 4)
INSERT INTO topics (certification_id, name, description, icon, month, order_index, estimated_days)
SELECT id, 'Lambda Expressions & Streams', 
       'Lambda syntax, functional interfaces, Stream API, Collectors', 
       '📕', 4, 6, 18
FROM certifications WHERE code = 'OCP-11';

INSERT INTO subtopics (topic_id, name, description, difficulty, estimated_days, priority, order_index)
SELECT t.id, s.name, s.description, s.difficulty, s.estimated_days, s.priority, s.order_index
FROM topics t, (VALUES
    ('Lambda Syntax & Built-in Functional Interfaces', 'Predicate, Function, Consumer, Supplier, BiFunction', 3, 4, 'CRITICAL', 1),
    ('Stream Pipeline (filter, map, reduce)', 'Intermediate vs terminal operations, lazy evaluation', 4, 5, 'CRITICAL', 2),
    ('Collectors & Grouping', 'toList, toMap, groupingBy, partitioningBy, reducing', 4, 4, 'CRITICAL', 3),
    ('Parallel Streams', 'parallelStream(), performance considerations, thread safety', 3, 3, 'HIGH', 4),
    ('Optional Class', 'Optional methods, orElse, orElseGet, orElseThrow, map, flatMap', 3, 2, 'HIGH', 5)
) AS s(name, description, difficulty, estimated_days, priority, order_index)
WHERE t.name = 'Lambda Expressions & Streams';

-- TOPIC 7: Java I/O API (Tháng 5)
INSERT INTO topics (certification_id, name, description, icon, month, order_index, estimated_days)
SELECT id, 'Java I/O API', 
       'I/O Streams, Serialization, java.nio.file API', 
       '📓', 5, 7, 8
FROM certifications WHERE code = 'OCP-11';

INSERT INTO subtopics (topic_id, name, description, difficulty, estimated_days, priority, order_index)
SELECT t.id, s.name, s.description, s.difficulty, s.estimated_days, s.priority, s.order_index
FROM topics t, (VALUES
    ('I/O Streams (Byte & Character)', 'InputStream, OutputStream, Reader, Writer, BufferedStreams', 3, 3, 'HIGH', 1),
    ('Serialization/Deserialization', 'Serializable, transient, serialVersionUID', 3, 2, 'HIGH', 2),
    ('java.nio.file API (Path, Files)', 'Path operations, Files methods, walking directories', 3, 3, 'CRITICAL', 3)
) AS s(name, description, difficulty, estimated_days, priority, order_index)
WHERE t.name = 'Java I/O API';

-- TOPIC 8: Concurrency (Tháng 5)
INSERT INTO topics (certification_id, name, description, icon, month, order_index, estimated_days)
SELECT id, 'Concurrency', 
       'Threads, ExecutorService, synchronization, concurrent collections', 
       '📓', 5, 8, 14
FROM certifications WHERE code = 'OCP-11';

INSERT INTO subtopics (topic_id, name, description, difficulty, estimated_days, priority, order_index)
SELECT t.id, s.name, s.description, s.difficulty, s.estimated_days, s.priority, s.order_index
FROM topics t, (VALUES
    ('Threads, Runnable, Callable', 'Thread lifecycle, Runnable vs Callable, Future', 3, 3, 'HIGH', 1),
    ('ExecutorService', 'Thread pools, submit, invokeAll, shutdown', 3, 3, 'CRITICAL', 2),
    ('Synchronization & Locks', 'synchronized, ReentrantLock, deadlock, livelock', 4, 4, 'CRITICAL', 3),
    ('Concurrent Collections', 'ConcurrentHashMap, CopyOnWriteArrayList, BlockingQueue', 3, 2, 'HIGH', 4),
    ('Atomic Variables', 'AtomicInteger, AtomicReference, compareAndSet', 3, 2, 'HIGH', 5)
) AS s(name, description, difficulty, estimated_days, priority, order_index)
WHERE t.name = 'Concurrency';

-- TOPIC 9: Java Platform Module System (Tháng 5)
INSERT INTO topics (certification_id, name, description, icon, month, order_index, estimated_days)
SELECT id, 'Java Platform Module System', 
       'Modules, module-info.java, exports, requires, services', 
       '📓', 5, 9, 7
FROM certifications WHERE code = 'OCP-11';

INSERT INTO subtopics (topic_id, name, description, difficulty, estimated_days, priority, order_index)
SELECT t.id, s.name, s.description, s.difficulty, s.estimated_days, s.priority, s.order_index
FROM topics t, (VALUES
    ('module-info.java', 'Module declaration, module types', 3, 2, 'HIGH', 1),
    ('exports, requires, provides, uses', 'Module directives, transitive dependencies', 3, 3, 'HIGH', 2),
    ('Automatic & Unnamed Modules', 'Migration strategies, classpath vs module path', 3, 2, 'HIGH', 3)
) AS s(name, description, difficulty, estimated_days, priority, order_index)
WHERE t.name = 'Java Platform Module System';

-- TOPIC 10: JDBC (Tháng 6)
INSERT INTO topics (certification_id, name, description, icon, month, order_index, estimated_days)
SELECT id, 'Database Applications with JDBC', 
       'Connection, Statement, PreparedStatement, ResultSet, Transactions', 
       '📔', 6, 10, 5
FROM certifications WHERE code = 'OCP-11';

INSERT INTO subtopics (topic_id, name, description, difficulty, estimated_days, priority, order_index)
SELECT t.id, s.name, s.description, s.difficulty, s.estimated_days, s.priority, s.order_index
FROM topics t, (VALUES
    ('Connection, Statement, PreparedStatement', 'DriverManager, Connection string, SQL injection prevention', 2, 2, 'HIGH', 1),
    ('ResultSet', 'Navigating results, column getters, scrollable ResultSet', 2, 2, 'HIGH', 2),
    ('Transactions', 'Auto-commit, commit, rollback, savepoints', 2, 1, 'MEDIUM', 3)
) AS s(name, description, difficulty, estimated_days, priority, order_index)
WHERE t.name = 'Database Applications with JDBC';

-- TOPIC 11: Secure Coding (Tháng 6)
INSERT INTO topics (certification_id, name, description, icon, month, order_index, estimated_days)
SELECT id, 'Secure Coding in Java SE Application', 
       'Input validation, DoS prevention, resource access security', 
       '📔', 6, 11, 3
FROM certifications WHERE code = 'OCP-11';

INSERT INTO subtopics (topic_id, name, description, difficulty, estimated_days, priority, order_index)
SELECT t.id, s.name, s.description, s.difficulty, s.estimated_days, s.priority, s.order_index
FROM topics t, (VALUES
    ('Input Validation', 'Validating user input, sanitization', 2, 1, 'MEDIUM', 1),
    ('Denial of Service Prevention', 'Resource limits, defensive coding', 2, 1, 'MEDIUM', 2),
    ('Resource Access Security', 'File permissions, security manager', 2, 1, 'MEDIUM', 3)
) AS s(name, description, difficulty, estimated_days, priority, order_index)
WHERE t.name = 'Secure Coding in Java SE Application';

-- TOPIC 12: Annotations (Tháng 6)
INSERT INTO topics (certification_id, name, description, icon, month, order_index, estimated_days)
SELECT id, 'Annotations', 
       'Built-in annotations, custom annotations, annotation processing', 
       '📔', 6, 12, 3
FROM certifications WHERE code = 'OCP-11';

INSERT INTO subtopics (topic_id, name, description, difficulty, estimated_days, priority, order_index)
SELECT t.id, s.name, s.description, s.difficulty, s.estimated_days, s.priority, s.order_index
FROM topics t, (VALUES
    ('Built-in Annotations', '@Override, @Deprecated, @SuppressWarnings, @FunctionalInterface', 2, 1, 'MEDIUM', 1),
    ('Custom Annotations', 'Creating annotations, @Target, @Retention', 2, 1, 'MEDIUM', 2),
    ('Annotation Processing', 'Reflection for annotations, annotation processors', 2, 1, 'LOW', 3)
) AS s(name, description, difficulty, estimated_days, priority, order_index)
WHERE t.name = 'Annotations';
