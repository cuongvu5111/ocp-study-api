-- Flyway Migration: Seed initial data
-- Version: V2
-- Description: Seed 12 topics OCP Java SE 11 và subtopics

-- Set UTF-8 encoding for proper Vietnamese character support
SET CLIENT_ENCODING TO 'UTF8';

-- =====================================================
-- TOPIC 1: Working with Java Data Types (Tháng 1)
-- =====================================================
INSERT INTO topics (name, description, icon, month, order_index, estimated_days)
VALUES ('Working with Java Data Types', 
        'Primitives, wrapper classes, operators, String, StringBuilder, và var keyword', 
        '📘', 1, 1, 8);

INSERT INTO subtopics (topic_id, name, description, difficulty, estimated_days, priority, order_index)
VALUES 
(1, 'Primitives và Wrapper Classes', 'int/Integer, double/Double, autoboxing, unboxing', 2, 2, 'HIGH', 1),
(1, 'Operators, Promotion, Casting', 'Numeric promotion, type casting, operator precedence', 3, 3, 'HIGH', 2),
(1, 'String và StringBuilder', 'Immutability, String pool, StringBuilder methods', 2, 2, 'HIGH', 3),
(1, 'Local Variable Type Inference (var)', 'Sử dụng var trong lambda, restrictions', 2, 1, 'MEDIUM', 4);

-- =====================================================
-- TOPIC 2: Controlling Program Flow (Tháng 1)
-- =====================================================
INSERT INTO topics (name, description, icon, month, order_index, estimated_days)
VALUES ('Controlling Program Flow', 
        'If/else, switch, loops, break, continue statements', 
        '📘', 1, 2, 3);

INSERT INTO subtopics (topic_id, name, description, difficulty, estimated_days, priority, order_index)
VALUES 
(2, 'if/else, switch statements', 'Conditional logic, switch expressions', 1, 1, 'MEDIUM', 1),
(2, 'Loops (for, while, do-while)', 'Loop constructs, enhanced for loop', 1, 1, 'MEDIUM', 2),
(2, 'break, continue, labels', 'Flow control statements, labeled loops', 2, 1, 'HIGH', 3);

-- =====================================================
-- TOPIC 3: Java Object-Oriented Approach (Tháng 2)
-- =====================================================
INSERT INTO topics (name, description, icon, month, order_index, estimated_days)
VALUES ('Java Object-Oriented Approach', 
        'Classes, objects, inheritance, polymorphism, interfaces, nested classes', 
        '📗', 2, 3, 20);

INSERT INTO subtopics (topic_id, name, description, difficulty, estimated_days, priority, order_index)
VALUES 
(3, 'Classes, Objects, Constructors', 'Object lifecycle, constructor chaining, this keyword', 2, 3, 'HIGH', 1),
(3, 'Inheritance, Polymorphism', 'extends, super, method overriding, instanceof', 3, 4, 'CRITICAL', 2),
(3, 'Abstract Classes vs Interfaces', 'Abstract methods, default/static interface methods', 3, 3, 'CRITICAL', 3),
(3, 'Encapsulation, Immutability', 'Access modifiers, immutable objects, defensive copying', 2, 2, 'HIGH', 4),
(3, 'Nested Classes', 'Inner, Static, Local, Anonymous classes', 3, 3, 'HIGH', 5),
(3, 'Enumerations', 'Enum methods, constructors, abstract methods in enums', 2, 2, 'MEDIUM', 6),
(3, 'Functional Interfaces', '@FunctionalInterface, SAM, built-in functional interfaces', 3, 3, 'CRITICAL', 7);

-- =====================================================
-- TOPIC 4: Exception Handling (Tháng 3)
-- =====================================================
INSERT INTO topics (name, description, icon, month, order_index, estimated_days)
VALUES ('Exception Handling', 
        'Try/catch, try-with-resources, custom exceptions, assertions', 
        '📙', 3, 4, 7);

INSERT INTO subtopics (topic_id, name, description, difficulty, estimated_days, priority, order_index)
VALUES 
(4, 'try/catch/finally', 'Exception hierarchy, checked vs unchecked', 2, 2, 'HIGH', 1),
(4, 'try-with-resources', 'AutoCloseable, suppressed exceptions', 3, 2, 'CRITICAL', 2),
(4, 'Multi-catch', 'Catching multiple exceptions, exception chaining', 2, 1, 'HIGH', 3),
(4, 'Custom Exceptions', 'Creating custom checked/unchecked exceptions', 2, 1, 'MEDIUM', 4),
(4, 'Assertions', 'assert statement, enabling assertions', 1, 1, 'LOW', 5);

-- =====================================================
-- TOPIC 5: Arrays and Collections (Tháng 3)
-- =====================================================
INSERT INTO topics (name, description, icon, month, order_index, estimated_days)
VALUES ('Arrays and Collections', 
        'Arrays, List, Set, Map, Deque, Generics, Comparator', 
        '📙', 3, 5, 13);

INSERT INTO subtopics (topic_id, name, description, difficulty, estimated_days, priority, order_index)
VALUES 
(5, 'Arrays', 'Array creation, manipulation, Arrays utility class', 2, 2, 'HIGH', 1),
(5, 'List, Set, Map, Deque', 'ArrayList, HashSet, HashMap, ArrayDeque, LinkedList', 3, 4, 'CRITICAL', 2),
(5, 'Generics & Wildcards', 'Generic types, bounds, wildcards (?, extends, super)', 4, 4, 'CRITICAL', 3),
(5, 'Comparator & Comparable', 'Natural ordering, custom comparators, chained comparators', 3, 2, 'HIGH', 4),
(5, 'Collection Convenience Methods', 'List.of(), Set.of(), Map.of(), copyOf()', 2, 1, 'MEDIUM', 5);

-- =====================================================
-- TOPIC 6: Lambda Expressions & Streams (Tháng 4)
-- =====================================================
INSERT INTO topics (name, description, icon, month, order_index, estimated_days)
VALUES ('Lambda Expressions & Streams', 
        'Lambda syntax, functional interfaces, Stream API, Collectors', 
        '📕', 4, 6, 18);

INSERT INTO subtopics (topic_id, name, description, difficulty, estimated_days, priority, order_index)
VALUES 
(6, 'Lambda Syntax & Built-in Functional Interfaces', 'Predicate, Function, Consumer, Supplier, BiFunction', 3, 4, 'CRITICAL', 1),
(6, 'Stream Pipeline (filter, map, reduce)', 'Intermediate vs terminal operations, lazy evaluation', 4, 5, 'CRITICAL', 2),
(6, 'Collectors & Grouping', 'toList, toMap, groupingBy, partitioningBy, reducing', 4, 4, 'CRITICAL', 3),
(6, 'Parallel Streams', 'parallelStream(), performance considerations, thread safety', 3, 3, 'HIGH', 4),
(6, 'Optional Class', 'Optional methods, orElse, orElseGet, orElseThrow, map, flatMap', 3, 2, 'HIGH', 5);

-- =====================================================
-- TOPIC 7: Java I/O API (Tháng 5)
-- =====================================================
INSERT INTO topics (name, description, icon, month, order_index, estimated_days)
VALUES ('Java I/O API', 
        'I/O Streams, Serialization, java.nio.file API', 
        '📓', 5, 7, 8);

INSERT INTO subtopics (topic_id, name, description, difficulty, estimated_days, priority, order_index)
VALUES 
(7, 'I/O Streams (Byte & Character)', 'InputStream, OutputStream, Reader, Writer, BufferedStreams', 3, 3, 'HIGH', 1),
(7, 'Serialization/Deserialization', 'Serializable, transient, serialVersionUID', 3, 2, 'HIGH', 2),
(7, 'java.nio.file API (Path, Files)', 'Path operations, Files methods, walking directories', 3, 3, 'CRITICAL', 3);

-- =====================================================
-- TOPIC 8: Concurrency (Tháng 5)
-- =====================================================
INSERT INTO topics (name, description, icon, month, order_index, estimated_days)
VALUES ('Concurrency', 
        'Threads, ExecutorService, synchronization, concurrent collections', 
        '📓', 5, 8, 14);

INSERT INTO subtopics (topic_id, name, description, difficulty, estimated_days, priority, order_index)
VALUES 
(8, 'Threads, Runnable, Callable', 'Thread lifecycle, Runnable vs Callable, Future', 3, 3, 'HIGH', 1),
(8, 'ExecutorService', 'Thread pools, submit, invokeAll, shutdown', 3, 3, 'CRITICAL', 2),
(8, 'Synchronization & Locks', 'synchronized, ReentrantLock, deadlock, livelock', 4, 4, 'CRITICAL', 3),
(8, 'Concurrent Collections', 'ConcurrentHashMap, CopyOnWriteArrayList, BlockingQueue', 3, 2, 'HIGH', 4),
(8, 'Atomic Variables', 'AtomicInteger, AtomicReference, compareAndSet', 3, 2, 'HIGH', 5);

-- =====================================================
-- TOPIC 9: Java Platform Module System (Tháng 5)
-- =====================================================
INSERT INTO topics (name, description, icon, month, order_index, estimated_days)
VALUES ('Java Platform Module System', 
        'Modules, module-info.java, exports, requires, services', 
        '📓', 5, 9, 7);

INSERT INTO subtopics (topic_id, name, description, difficulty, estimated_days, priority, order_index)
VALUES 
(9, 'module-info.java', 'Module declaration, module types', 3, 2, 'HIGH', 1),
(9, 'exports, requires, provides, uses', 'Module directives, transitive dependencies', 3, 3, 'HIGH', 2),
(9, 'Automatic & Unnamed Modules', 'Migration strategies, classpath vs module path', 3, 2, 'HIGH', 3);

-- =====================================================
-- TOPIC 10: JDBC (Tháng 6)
-- =====================================================
INSERT INTO topics (name, description, icon, month, order_index, estimated_days)
VALUES ('Database Applications with JDBC', 
        'Connection, Statement, PreparedStatement, ResultSet, Transactions', 
        '📔', 6, 10, 5);

INSERT INTO subtopics (topic_id, name, description, difficulty, estimated_days, priority, order_index)
VALUES 
(10, 'Connection, Statement, PreparedStatement', 'DriverManager, Connection string, SQL injection prevention', 2, 2, 'HIGH', 1),
(10, 'ResultSet', 'Navigating results, column getters, scrollable ResultSet', 2, 2, 'HIGH', 2),
(10, 'Transactions', 'Auto-commit, commit, rollback, savepoints', 2, 1, 'MEDIUM', 3);

-- =====================================================
-- TOPIC 11: Secure Coding (Tháng 6)
-- =====================================================
INSERT INTO topics (name, description, icon, month, order_index, estimated_days)
VALUES ('Secure Coding in Java SE Application', 
        'Input validation, DoS prevention, resource access security', 
        '📔', 6, 11, 3);

INSERT INTO subtopics (topic_id, name, description, difficulty, estimated_days, priority, order_index)
VALUES 
(11, 'Input Validation', 'Validating user input, sanitization', 2, 1, 'MEDIUM', 1),
(11, 'Denial of Service Prevention', 'Resource limits, defensive coding', 2, 1, 'MEDIUM', 2),
(11, 'Resource Access Security', 'File permissions, security manager', 2, 1, 'MEDIUM', 3);

-- =====================================================
-- TOPIC 12: Annotations (Tháng 6)
-- =====================================================
INSERT INTO topics (name, description, icon, month, order_index, estimated_days)
VALUES ('Annotations', 
        'Built-in annotations, custom annotations, annotation processing', 
        '📔', 6, 12, 3);

INSERT INTO subtopics (topic_id, name, description, difficulty, estimated_days, priority, order_index)
VALUES 
(12, 'Built-in Annotations', '@Override, @Deprecated, @SuppressWarnings, @FunctionalInterface', 2, 1, 'MEDIUM', 1),
(12, 'Custom Annotations', 'Creating annotations, @Target, @Retention', 2, 1, 'MEDIUM', 2),
(12, 'Annotation Processing', 'Reflection for annotations, annotation processors', 2, 1, 'LOW', 3);
