--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2 (Debian 17.2-1.pgdg120+1)
-- Dumped by pg_dump version 17.2 (Debian 17.2-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: chapter_complete; Type: TABLE; Schema: public; Owner: coursity_user
--

CREATE TABLE public.chapter_complete (
    id integer NOT NULL,
    user_id integer NOT NULL,
    course_id integer NOT NULL,
    chapter_id integer NOT NULL
);


ALTER TABLE public.chapter_complete OWNER TO coursity_user;

--
-- Name: chapter_complete_id_seq; Type: SEQUENCE; Schema: public; Owner: coursity_user
--

CREATE SEQUENCE public.chapter_complete_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.chapter_complete_id_seq OWNER TO coursity_user;

--
-- Name: chapter_complete_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: coursity_user
--

ALTER SEQUENCE public.chapter_complete_id_seq OWNED BY public.chapter_complete.id;


--
-- Name: chapter_progress; Type: TABLE; Schema: public; Owner: coursity_user
--

CREATE TABLE public.chapter_progress (
    id integer NOT NULL,
    user_id integer NOT NULL,
    course_id integer NOT NULL,
    chapter_id integer NOT NULL,
    is_completed boolean DEFAULT false NOT NULL
);


ALTER TABLE public.chapter_progress OWNER TO coursity_user;

--
-- Name: chapter_progress_id_seq; Type: SEQUENCE; Schema: public; Owner: coursity_user
--

CREATE SEQUENCE public.chapter_progress_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.chapter_progress_id_seq OWNER TO coursity_user;

--
-- Name: chapter_progress_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: coursity_user
--

ALTER SEQUENCE public.chapter_progress_id_seq OWNED BY public.chapter_progress.id;


--
-- Name: chapters; Type: TABLE; Schema: public; Owner: coursity_user
--

CREATE TABLE public.chapters (
    id integer NOT NULL,
    title character varying NOT NULL,
    "position" integer NOT NULL,
    chapter_lesson_count integer NOT NULL,
    course_id integer NOT NULL,
    created_by character varying,
    updated_by character varying,
    deleted_by character varying,
    deleted_at timestamp with time zone,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.chapters OWNER TO coursity_user;

--
-- Name: chapters_id_seq; Type: SEQUENCE; Schema: public; Owner: coursity_user
--

CREATE SEQUENCE public.chapters_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.chapters_id_seq OWNER TO coursity_user;

--
-- Name: chapters_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: coursity_user
--

ALTER SEQUENCE public.chapters_id_seq OWNED BY public.chapters.id;


--
-- Name: course_progress; Type: TABLE; Schema: public; Owner: coursity_user
--

CREATE TABLE public.course_progress (
    id integer NOT NULL,
    progress_percent numeric DEFAULT '0'::numeric NOT NULL,
    user_id integer NOT NULL,
    course_id integer NOT NULL,
    created_by character varying,
    updated_by character varying,
    deleted_by character varying,
    deleted_at timestamp with time zone,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    last_lesson_id integer,
    completed_at timestamp without time zone
);


ALTER TABLE public.course_progress OWNER TO coursity_user;

--
-- Name: course_progress_id_seq; Type: SEQUENCE; Schema: public; Owner: coursity_user
--

CREATE SEQUENCE public.course_progress_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.course_progress_id_seq OWNER TO coursity_user;

--
-- Name: course_progress_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: coursity_user
--

ALTER SEQUENCE public.course_progress_id_seq OWNED BY public.course_progress.id;


--
-- Name: courses; Type: TABLE; Schema: public; Owner: coursity_user
--

CREATE TABLE public.courses (
    id integer NOT NULL,
    title character varying NOT NULL,
    description text NOT NULL,
    price numeric DEFAULT '0'::numeric NOT NULL,
    category character varying,
    status character varying DEFAULT 'draft'::character varying NOT NULL,
    discount_enabled boolean DEFAULT false NOT NULL,
    discount_start_time timestamp without time zone DEFAULT now() NOT NULL,
    discount_end_time timestamp without time zone DEFAULT now() NOT NULL,
    discount_price numeric,
    slug character varying NOT NULL,
    image_url character varying NOT NULL,
    is_free boolean DEFAULT false NOT NULL,
    requirements jsonb,
    will_learns jsonb,
    instructor_id integer,
    created_by character varying,
    updated_by character varying,
    deleted_by character varying,
    deleted_at timestamp with time zone,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.courses OWNER TO coursity_user;

--
-- Name: courses_id_seq; Type: SEQUENCE; Schema: public; Owner: coursity_user
--

CREATE SEQUENCE public.courses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.courses_id_seq OWNER TO coursity_user;

--
-- Name: courses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: coursity_user
--

ALTER SEQUENCE public.courses_id_seq OWNED BY public.courses.id;


--
-- Name: enrollments; Type: TABLE; Schema: public; Owner: coursity_user
--

CREATE TABLE public.enrollments (
    id integer NOT NULL,
    user_id integer NOT NULL,
    course_id integer NOT NULL,
    created_by character varying,
    updated_by character varying,
    deleted_by character varying,
    deleted_at timestamp with time zone,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.enrollments OWNER TO coursity_user;

--
-- Name: enrollments_id_seq; Type: SEQUENCE; Schema: public; Owner: coursity_user
--

CREATE SEQUENCE public.enrollments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.enrollments_id_seq OWNER TO coursity_user;

--
-- Name: enrollments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: coursity_user
--

ALTER SEQUENCE public.enrollments_id_seq OWNED BY public.enrollments.id;


--
-- Name: files; Type: TABLE; Schema: public; Owner: coursity_user
--

CREATE TABLE public.files (
    created_by character varying,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_by character varying,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_by character varying,
    deleted_at timestamp with time zone,
    id integer NOT NULL,
    originalname character varying NOT NULL,
    mimetype character varying NOT NULL,
    filename character varying NOT NULL,
    minio_filename character varying NOT NULL,
    path character varying NOT NULL,
    size numeric NOT NULL,
    is_public boolean DEFAULT false NOT NULL,
    destination character varying NOT NULL
);


ALTER TABLE public.files OWNER TO coursity_user;

--
-- Name: files_id_seq; Type: SEQUENCE; Schema: public; Owner: coursity_user
--

CREATE SEQUENCE public.files_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.files_id_seq OWNER TO coursity_user;

--
-- Name: files_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: coursity_user
--

ALTER SEQUENCE public.files_id_seq OWNED BY public.files.id;


--
-- Name: lesson_complete; Type: TABLE; Schema: public; Owner: coursity_user
--

CREATE TABLE public.lesson_complete (
    id integer NOT NULL,
    user_id integer NOT NULL,
    lesson_id integer NOT NULL,
    created_by character varying,
    updated_by character varying,
    deleted_by character varying,
    deleted_at timestamp with time zone,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    chapter_id integer NOT NULL,
    course_id integer NOT NULL
);


ALTER TABLE public.lesson_complete OWNER TO coursity_user;

--
-- Name: lesson_complete_id_seq; Type: SEQUENCE; Schema: public; Owner: coursity_user
--

CREATE SEQUENCE public.lesson_complete_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.lesson_complete_id_seq OWNER TO coursity_user;

--
-- Name: lesson_complete_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: coursity_user
--

ALTER SEQUENCE public.lesson_complete_id_seq OWNED BY public.lesson_complete.id;


--
-- Name: lessons; Type: TABLE; Schema: public; Owner: coursity_user
--

CREATE TABLE public.lessons (
    id integer NOT NULL,
    duration numeric NOT NULL,
    video_url character varying NOT NULL,
    image_url character varying NOT NULL,
    video_provider character varying NOT NULL,
    title character varying NOT NULL,
    chapter_id integer NOT NULL,
    created_by character varying,
    updated_by character varying,
    deleted_by character varying,
    deleted_at timestamp with time zone,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    "position" integer
);


ALTER TABLE public.lessons OWNER TO coursity_user;

--
-- Name: lessons_id_seq; Type: SEQUENCE; Schema: public; Owner: coursity_user
--

CREATE SEQUENCE public.lessons_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.lessons_id_seq OWNER TO coursity_user;

--
-- Name: lessons_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: coursity_user
--

ALTER SEQUENCE public.lessons_id_seq OWNED BY public.lessons.id;


--
-- Name: migrations; Type: TABLE; Schema: public; Owner: coursity_user
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    "timestamp" bigint NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.migrations OWNER TO coursity_user;

--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: coursity_user
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.migrations_id_seq OWNER TO coursity_user;

--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: coursity_user
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: coursity_user
--

CREATE TABLE public.users (
    id integer NOT NULL,
    full_name character varying NOT NULL,
    email character varying NOT NULL,
    password character varying,
    role character varying DEFAULT 'student'::character varying NOT NULL,
    created_by character varying,
    updated_by character varying,
    deleted_by character varying,
    deleted_at timestamp with time zone,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    clerk_user_id character varying,
    image_url character varying
);


ALTER TABLE public.users OWNER TO coursity_user;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: coursity_user
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO coursity_user;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: coursity_user
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: chapter_complete id; Type: DEFAULT; Schema: public; Owner: coursity_user
--

ALTER TABLE ONLY public.chapter_complete ALTER COLUMN id SET DEFAULT nextval('public.chapter_complete_id_seq'::regclass);


--
-- Name: chapter_progress id; Type: DEFAULT; Schema: public; Owner: coursity_user
--

ALTER TABLE ONLY public.chapter_progress ALTER COLUMN id SET DEFAULT nextval('public.chapter_progress_id_seq'::regclass);


--
-- Name: chapters id; Type: DEFAULT; Schema: public; Owner: coursity_user
--

ALTER TABLE ONLY public.chapters ALTER COLUMN id SET DEFAULT nextval('public.chapters_id_seq'::regclass);


--
-- Name: course_progress id; Type: DEFAULT; Schema: public; Owner: coursity_user
--

ALTER TABLE ONLY public.course_progress ALTER COLUMN id SET DEFAULT nextval('public.course_progress_id_seq'::regclass);


--
-- Name: courses id; Type: DEFAULT; Schema: public; Owner: coursity_user
--

ALTER TABLE ONLY public.courses ALTER COLUMN id SET DEFAULT nextval('public.courses_id_seq'::regclass);


--
-- Name: enrollments id; Type: DEFAULT; Schema: public; Owner: coursity_user
--

ALTER TABLE ONLY public.enrollments ALTER COLUMN id SET DEFAULT nextval('public.enrollments_id_seq'::regclass);


--
-- Name: files id; Type: DEFAULT; Schema: public; Owner: coursity_user
--

ALTER TABLE ONLY public.files ALTER COLUMN id SET DEFAULT nextval('public.files_id_seq'::regclass);


--
-- Name: lesson_complete id; Type: DEFAULT; Schema: public; Owner: coursity_user
--

ALTER TABLE ONLY public.lesson_complete ALTER COLUMN id SET DEFAULT nextval('public.lesson_complete_id_seq'::regclass);


--
-- Name: lessons id; Type: DEFAULT; Schema: public; Owner: coursity_user
--

ALTER TABLE ONLY public.lessons ALTER COLUMN id SET DEFAULT nextval('public.lessons_id_seq'::regclass);


--
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: coursity_user
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: coursity_user
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: chapter_complete; Type: TABLE DATA; Schema: public; Owner: coursity_user
--

COPY public.chapter_complete (id, user_id, course_id, chapter_id) FROM stdin;
5	65	1	2
6	65	1	1
\.


--
-- Data for Name: chapter_progress; Type: TABLE DATA; Schema: public; Owner: coursity_user
--

COPY public.chapter_progress (id, user_id, course_id, chapter_id, is_completed) FROM stdin;
\.


--
-- Data for Name: chapters; Type: TABLE DATA; Schema: public; Owner: coursity_user
--

COPY public.chapters (id, title, "position", chapter_lesson_count, course_id, created_by, updated_by, deleted_by, deleted_at, updated_at, created_at) FROM stdin;
3	Advanced JavaScript Basics	1	6	2	\N	\N	\N	\N	2025-04-03 05:00:00+00	2025-04-03 03:00:00+00
4	Asynchronous JavaScript	2	3	2	\N	\N	\N	\N	2025-04-04 05:00:00+00	2025-04-04 03:00:00+00
5	Data Structures Overview	1	7	3	\N	\N	\N	\N	2025-04-05 05:00:00+00	2025-04-05 03:00:00+00
6	Algorithm Design Techniques	2	5	3	\N	\N	\N	\N	2025-04-06 05:00:00+00	2025-04-06 03:00:00+00
7	Introduction to React	1	2	4	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00
8	React State and Props	2	3	4	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00
9	React Hooks	3	3	4	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00
10	React Router	4	2	4	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00
11	React Context API	5	2	4	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00
12	React Performance Optimization	6	3	4	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00
13	Node.js Event Loop	1	2	5	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00
14	Asynchronous Programming	2	3	5	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00
15	Node.js Internals	3	2	5	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00
16	Building Scalable Applications	4	3	5	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00
17	Node.js Streams	5	2	5	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00
18	Testing in Node.js	6	3	5	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00
19	Frontend Basics	1	3	6	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00
20	Backend Development	2	3	6	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00
21	Database Integration	3	2	6	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00
22	Deployment and Scaling	4	2	6	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00
23	Frontend Frameworks	5	3	6	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00
24	Advanced Backend Topics	6	3	6	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00
25	Introduction to Python	1	3	7	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00
26	Data Analysis with Pandas	2	3	7	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00
27	Data Visualization	3	2	7	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00
28	Machine Learning Basics	4	2	7	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00
29	Advanced Python Concepts	5	3	7	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00
30	Python for Data Engineering	6	2	7	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00
31	Introduction to UI/UX Design	1	3	8	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00
32	Wireframing and Prototyping	2	2	8	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00
33	Accessibility and Usability	3	2	8	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00
34	Introduction to Flutter	1	3	9	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00
35	State Management in Flutter	2	2	9	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00
36	Navigation and Routing	3	2	9	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00
37	Introduction to Cybersecurity	1	3	10	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00
38	Network Security Basics	2	2	10	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00
39	Ethical Hacking Overview	3	2	10	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00
1	Introduction to Programming Concepts	1	2	1	\N	\N	\N	\N	2025-04-01 05:00:00+00	2025-04-01 03:00:00+00
2	Control Structures and Loops	2	1	1	\N	\N	\N	\N	2025-04-02 05:00:00+00	2025-04-02 03:00:00+00
\.


--
-- Data for Name: course_progress; Type: TABLE DATA; Schema: public; Owner: coursity_user
--

COPY public.course_progress (id, progress_percent, user_id, course_id, created_by, updated_by, deleted_by, deleted_at, updated_at, created_at, last_lesson_id, completed_at) FROM stdin;
5	100	65	1	\N	\N	\N	\N	2025-05-02 09:12:07.300791+00	2025-05-02 09:12:07.300791+00	3	2025-05-06 15:42:02.509578
\.


--
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: coursity_user
--

COPY public.courses (id, title, description, price, category, status, discount_enabled, discount_start_time, discount_end_time, discount_price, slug, image_url, is_free, requirements, will_learns, instructor_id, created_by, updated_by, deleted_by, deleted_at, updated_at, created_at) FROM stdin;
1	Introduction to Programming	Learn the basics of programming with this beginner-friendly course.	0	Programming	published	f	2025-04-01 00:00:00	2025-04-30 23:59:59	\N	introduction-to-programming	https://example.com/images/course1.jpg	t	["Basic computer skills", "Willingness to learn"]	["Understand programming basics", "Write simple programs"]	1	\N	\N	\N	\N	2025-04-28 07:35:42.467277+00	2025-04-28 07:35:42.467277+00
2	Advanced JavaScript	Deep dive into JavaScript concepts and advanced techniques.	49.99	Web Development	published	t	2025-04-15 00:00:00	2025-04-20 23:59:59	29.99	advanced-javascript	https://example.com/images/course2.jpg	f	["Basic JavaScript knowledge", "Experience with web development"]	["Master advanced JavaScript concepts", "Build complex web applications"]	2	\N	\N	\N	\N	2025-04-28 07:35:42.467277+00	2025-04-28 07:35:42.467277+00
3	Data Structures and Algorithms	Learn essential data structures and algorithms for coding interviews.	99.99	Computer Science	draft	f	2025-05-01 00:00:00	2025-05-31 23:59:59	\N	data-structures-algorithms	https://example.com/images/course3.jpg	f	["Basic programming knowledge"]	["Understand data structures", "Solve algorithmic problems"]	1	\N	\N	\N	\N	2025-04-28 07:35:42.467277+00	2025-04-28 07:35:42.467277+00
4	React for Beginners	Learn the basics of React, including components, state, and props.	500000	\N	draft	f	2025-05-04 14:18:03.632491	2025-05-04 14:18:03.632491	300000	react-for-beginners	/images/course-1.jpg	f	["Basic knowledge of JavaScript", "A computer with internet access"]	["Understand React components", "Manage state and props", "Build a simple React application"]	\N	\N	\N	\N	\N	2025-05-04 07:18:03.632491+00	2025-05-04 07:18:03.632491+00
5	Advanced Node.js	Deep dive into Node.js with advanced concepts and best practices.	800000	\N	draft	f	2025-05-04 14:18:03.632491	2025-05-04 14:18:03.632491	600000	advanced-nodejs	/images/course-1.jpg	f	["Intermediate knowledge of JavaScript", "Experience with Node.js basics"]	["Master asynchronous programming", "Understand Node.js internals", "Build scalable applications"]	\N	\N	\N	\N	\N	2025-05-04 07:18:03.632491+00	2025-05-04 07:18:03.632491+00
6	Fullstack Web Development	Become a fullstack developer by learning both frontend and backend technologies.	1000000	\N	draft	f	2025-05-04 14:18:03.632491	2025-05-04 14:18:03.632491	750000	fullstack-web-development	/images/course-1.jpg	f	["Basic knowledge of HTML, CSS, and JavaScript", "Willingness to learn"]	["Build responsive web applications", "Work with databases", "Deploy fullstack applications"]	\N	\N	\N	\N	\N	2025-05-04 07:18:03.632491+00	2025-05-04 07:18:03.632491+00
7	Python for Data Science	Master Python and its powerful libraries for data analysis, visualization, and machine learning.	700000	\N	draft	f	2025-05-04 14:18:03.632	2025-05-04 14:18:03.632	500000	python-for-data-science	/images/course-1.jpg	f	["No prior coding experience required", "Basic understanding of math/statistics is helpful"]	["Python programming fundamentals", "Using Pandas and NumPy", "Data visualization with Matplotlib and Seaborn", "Basic machine learning with Scikit-learn"]	\N	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00
8	UI/UX Design Principles	Learn to create beautiful, user-friendly interfaces and experiences through practical design principles.	600000	\N	draft	f	2025-05-04 14:18:03.632	2025-05-04 14:18:03.632	400000	ui-ux-design-principles	/images/course-1.jpg	f	["Interest in design", "No design experience needed"]	["User-centered design process", "Wireframing and prototyping", "Design tools like Figma", "Accessibility and usability"]	\N	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00
9	Build Mobile Apps with Flutter	Create beautiful cross-platform mobile apps using Dart and the Flutter framework.	800000	\N	draft	f	2025-05-04 14:18:03.632	2025-05-04 14:18:03.632	600000	mobile-apps-with-flutter	/images/course-1.jpg	f	["Basic programming knowledge", "Familiarity with object-oriented programming"]	["Flutter UI components", "Navigation and routing", "State management with Provider", "Deploying apps to iOS and Android"]	\N	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00
10	Intro to Cybersecurity	Explore the fundamentals of cybersecurity and learn how to protect systems and data.	139.99	\N	draft	f	2025-05-04 14:18:03.632	2025-05-04 14:18:03.632	89.99	intro-to-cybersecurity	/images/course-1.jpg	f	["General IT knowledge", "Curiosity about security threats and solutions"]	["Cybersecurity concepts", "Network security basics", "Ethical hacking overview", "Best practices for secure systems"]	\N	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00
\.


--
-- Data for Name: enrollments; Type: TABLE DATA; Schema: public; Owner: coursity_user
--

COPY public.enrollments (id, user_id, course_id, created_by, updated_by, deleted_by, deleted_at, updated_at, created_at) FROM stdin;
6	65	1	\N	\N	\N	\N	2025-05-05 09:46:55.721153+00	2025-05-05 09:46:55.721153+00
\.


--
-- Data for Name: files; Type: TABLE DATA; Schema: public; Owner: coursity_user
--

COPY public.files (created_by, created_at, updated_by, updated_at, deleted_by, deleted_at, id, originalname, mimetype, filename, minio_filename, path, size, is_public, destination) FROM stdin;
\N	2025-05-07 07:24:58.474899+00	\N	2025-05-07 07:24:58.474899+00	\N	\N	7	3460350.jpg	image/jpeg	abc2c1f9-a7df-4c7b-bf7c-a2cdc2aa0387	test/3460350.jpg	N/A	547387	t	N/A
\N	2025-05-07 15:15:26.170375+00	\N	2025-05-07 15:15:26.170375+00	\N	\N	8	8_SOCKET - 1 - 1508.mp4	video/mp4	c03eb43d-37dd-4c7e-a716-2e1107bfd748	test/8_SOCKET - 1 - 1508.mp4	N/A	623928758	t	N/A
\N	2025-05-07 15:27:13.139922+00	\N	2025-05-07 15:27:13.139922+00	\N	\N	9	8_SOCKET - 1 - 1508.mp4	video/mp4	c096fb5f-7307-4a99-b1d4-4166599d63a0	test/8_SOCKET - 1 - 1508.mp4	N/A	623928758	t	N/A
\.


--
-- Data for Name: lesson_complete; Type: TABLE DATA; Schema: public; Owner: coursity_user
--

COPY public.lesson_complete (id, user_id, lesson_id, created_by, updated_by, deleted_by, deleted_at, updated_at, created_at, chapter_id, course_id) FROM stdin;
14	65	1	\N	\N	\N	\N	2025-05-06 14:16:26.034349+00	2025-05-06 14:16:26.034349+00	1	1
15	65	2	\N	\N	\N	\N	2025-05-06 14:16:26.807635+00	2025-05-06 14:16:26.807635+00	1	1
30	65	3	\N	\N	\N	\N	2025-05-06 15:42:02.509578+00	2025-05-06 15:42:02.509578+00	2	1
\.


--
-- Data for Name: lessons; Type: TABLE DATA; Schema: public; Owner: coursity_user
--

COPY public.lessons (id, duration, video_url, image_url, video_provider, title, chapter_id, created_by, updated_by, deleted_by, deleted_at, updated_at, created_at, "position") FROM stdin;
1	600	https://example.com/videos/intro-to-programming.mp4	https://example.com/images/intro-to-programming.jpg	YouTube	Introduction to Programming	1	\N	\N	\N	\N	2025-04-01 05:00:00+00	2025-04-01 03:00:00+00	1
2	900	https://example.com/videos/variables.mp4	https://example.com/images/variables.jpg	YouTube	Variables and Data Types	1	\N	\N	\N	\N	2025-04-02 05:00:00+00	2025-04-02 03:00:00+00	2
3	1200	https://example.com/videos/loops.mp4	https://example.com/images/loops.jpg	Vimeo	Control Structures and Loops	2	\N	\N	\N	\N	2025-04-03 05:00:00+00	2025-04-03 03:00:00+00	1
4	1500	https://example.com/videos/js-basics.mp4	https://example.com/images/js-basics.jpg	YouTube	JavaScript Basics	3	\N	\N	\N	\N	2025-04-04 05:00:00+00	2025-04-04 03:00:00+00	1
5	1800	https://example.com/videos/async-js.mp4	https://example.com/images/async-js.jpg	YouTube	Asynchronous JavaScript	3	\N	\N	\N	\N	2025-04-05 05:00:00+00	2025-04-05 03:00:00+00	2
6	2100	https://example.com/videos/data-structures.mp4	https://example.com/images/data-structures.jpg	Vimeo	Data Structures Overview	5	\N	\N	\N	\N	2025-04-06 05:00:00+00	2025-04-06 03:00:00+00	1
7	2400	https://example.com/videos/algorithm-design.mp4	https://example.com/images/algorithm-design.jpg	YouTube	Algorithm Design Techniques	6	\N	\N	\N	\N	2025-04-07 05:00:00+00	2025-04-07 03:00:00+00	1
8	1800	https://example.com/videos/intro-to-react.mp4	/images/course-1.jpg	YouTube	What is React?	7	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	1
9	2100	https://example.com/videos/setup-react.mp4	/images/course-1.jpg	YouTube	Setting up React	7	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	2
10	2400	https://example.com/videos/state-and-props.mp4	/images/course-1.jpg	YouTube	Understanding State and Props	8	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	1
11	2000	https://example.com/videos/props-in-depth.mp4	/images/course-1.jpg	YouTube	Props in Depth	8	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	2
12	2200	https://example.com/videos/state-management.mp4	/images/course-1.jpg	YouTube	State Management Basics	8	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	3
13	2500	https://example.com/videos/hooks-intro.mp4	/images/course-1.jpg	YouTube	Introduction to Hooks	9	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	1
14	2700	https://example.com/videos/use-state.mp4	/images/course-1.jpg	YouTube	Using useState	9	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	2
15	2600	https://example.com/videos/use-effect.mp4	/images/course-1.jpg	YouTube	Using useEffect	9	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	3
16	2400	https://example.com/videos/router-intro.mp4	/images/course-1.jpg	YouTube	Introduction to React Router	10	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	1
17	2300	https://example.com/videos/router-advanced.mp4	/images/course-1.jpg	YouTube	Advanced Routing Techniques	10	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	2
18	2600	https://example.com/videos/context-api-intro.mp4	/images/course-1.jpg	YouTube	Introduction to Context API	11	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	1
19	2800	https://example.com/videos/context-api-usage.mp4	/images/course-1.jpg	YouTube	Using Context API	11	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	2
20	3000	https://example.com/videos/performance-intro.mp4	/images/course-1.jpg	YouTube	Introduction to Performance Optimization	12	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	1
21	3200	https://example.com/videos/memoization.mp4	/images/course-1.jpg	YouTube	Using Memoization	12	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	2
22	3100	https://example.com/videos/code-splitting.mp4	/images/course-1.jpg	YouTube	Code Splitting and Lazy Loading	12	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	3
23	1800	https://example.com/videos/event-loop-intro.mp4	/images/course-1.jpg	YouTube	Introduction to Event Loop	13	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	1
24	2000	https://example.com/videos/event-loop-deep-dive.mp4	/images/course-1.jpg	YouTube	Deep Dive into Event Loop	13	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	2
25	2200	https://example.com/videos/async-programming-intro.mp4	/images/course-1.jpg	YouTube	Introduction to Asynchronous Programming	14	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	1
26	2400	https://example.com/videos/promises.mp4	/images/course-1.jpg	YouTube	Working with Promises	14	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	2
27	2600	https://example.com/videos/async-await.mp4	/images/course-1.jpg	YouTube	Using Async/Await	14	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	3
28	2500	https://example.com/videos/node-internals-intro.mp4	/images/course-1.jpg	YouTube	Introduction to Node.js Internals	15	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	1
29	2700	https://example.com/videos/event-emitter.mp4	/images/course-1.jpg	YouTube	Understanding Event Emitters	15	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	2
30	2800	https://example.com/videos/scalable-architecture.mp4	/images/course-1.jpg	YouTube	Scalable Architecture Design	16	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	1
31	3000	https://example.com/videos/load-balancing.mp4	/images/course-1.jpg	YouTube	Load Balancing Techniques	16	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	2
32	3200	https://example.com/videos/caching-strategies.mp4	/images/course-1.jpg	YouTube	Caching Strategies	16	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	3
33	2000	https://example.com/videos/streams-intro.mp4	/images/course-1.jpg	YouTube	Introduction to Streams	17	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	1
34	2200	https://example.com/videos/streams-usage.mp4	/images/course-1.jpg	YouTube	Using Streams in Node.js	17	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	2
35	2400	https://example.com/videos/testing-intro.mp4	/images/course-1.jpg	YouTube	Introduction to Testing	18	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	1
36	2600	https://example.com/videos/unit-testing.mp4	/images/course-1.jpg	YouTube	Unit Testing with Mocha	18	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	2
37	2800	https://example.com/videos/integration-testing.mp4	/images/course-1.jpg	YouTube	Integration Testing with Chai	18	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	3
38	2000	https://example.com/videos/html-basics.mp4	/images/course-1.jpg	YouTube	HTML Basics	19	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	1
39	2200	https://example.com/videos/css-basics.mp4	/images/course-1.jpg	YouTube	CSS Basics	19	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	2
40	2400	https://example.com/videos/javascript-basics.mp4	/images/course-1.jpg	YouTube	JavaScript Basics	19	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	3
41	2600	https://example.com/videos/nodejs-intro.mp4	/images/course-1.jpg	YouTube	Introduction to Node.js	20	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	1
42	2800	https://example.com/videos/express-basics.mp4	/images/course-1.jpg	YouTube	Building APIs with Express	20	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	2
43	3000	https://example.com/videos/authentication.mp4	/images/course-1.jpg	YouTube	Authentication and Security	20	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	3
44	2500	https://example.com/videos/database-intro.mp4	/images/course-1.jpg	YouTube	Introduction to Databases	21	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	1
45	2700	https://example.com/videos/mongodb-basics.mp4	/images/course-1.jpg	YouTube	Working with MongoDB	21	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	2
46	2800	https://example.com/videos/deployment.mp4	/images/course-1.jpg	YouTube	Deploying Applications	22	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	1
47	3000	https://example.com/videos/scaling.mp4	/images/course-1.jpg	YouTube	Scaling Applications	22	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	2
48	2200	https://example.com/videos/react-intro.mp4	/images/course-1.jpg	YouTube	Introduction to React	23	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	1
49	2400	https://example.com/videos/vue-intro.mp4	/images/course-1.jpg	YouTube	Introduction to Vue.js	23	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	2
50	2600	https://example.com/videos/angular-intro.mp4	/images/course-1.jpg	YouTube	Introduction to Angular	23	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	3
51	2800	https://example.com/videos/graphql-intro.mp4	/images/course-1.jpg	YouTube	Introduction to GraphQL	24	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	1
52	3000	https://example.com/videos/websockets.mp4	/images/course-1.jpg	YouTube	Using WebSockets	24	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	2
53	3200	https://example.com/videos/microservices.mp4	/images/course-1.jpg	YouTube	Building Microservices	24	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	3
54	1800	https://example.com/videos/python-intro.mp4	/images/course-1.jpg	YouTube	What is Python?	25	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	1
55	2000	https://example.com/videos/python-setup.mp4	/images/course-1.jpg	YouTube	Setting up Python	25	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	2
56	2200	https://example.com/videos/python-syntax.mp4	/images/course-1.jpg	YouTube	Python Syntax Basics	25	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	3
57	2400	https://example.com/videos/pandas-intro.mp4	/images/course-1.jpg	YouTube	Introduction to Pandas	26	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	1
58	2600	https://example.com/videos/pandas-dataframe.mp4	/images/course-1.jpg	YouTube	Working with DataFrames	26	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	2
59	2800	https://example.com/videos/pandas-operations.mp4	/images/course-1.jpg	YouTube	Data Operations with Pandas	26	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	3
60	3000	https://example.com/videos/matplotlib-intro.mp4	/images/course-1.jpg	YouTube	Introduction to Matplotlib	27	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	1
61	3200	https://example.com/videos/seaborn-intro.mp4	/images/course-1.jpg	YouTube	Data Visualization with Seaborn	27	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	2
62	3400	https://example.com/videos/ml-intro.mp4	/images/course-1.jpg	YouTube	Introduction to Machine Learning	28	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	1
63	3600	https://example.com/videos/scikit-learn.mp4	/images/course-1.jpg	YouTube	Using Scikit-learn for ML	28	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	2
64	2000	https://example.com/videos/advanced-python-1.mp4	/images/course-1.jpg	YouTube	Decorators in Python	29	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	1
65	2200	https://example.com/videos/advanced-python-2.mp4	/images/course-1.jpg	YouTube	Generators and Iterators	29	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	2
66	2400	https://example.com/videos/advanced-python-3.mp4	/images/course-1.jpg	YouTube	Context Managers	29	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	3
67	2600	https://example.com/videos/data-engineering-1.mp4	/images/course-1.jpg	YouTube	Introduction to Data Engineering	30	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	1
68	2800	https://example.com/videos/data-engineering-2.mp4	/images/course-1.jpg	YouTube	ETL Pipelines with Python	30	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	2
69	1800	https://example.com/videos/uiux-intro.mp4	/images/course-1.jpg	YouTube	What is UI/UX Design?	31	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	1
70	2000	https://example.com/videos/design-principles.mp4	/images/course-1.jpg	YouTube	Design Principles	31	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	2
71	2200	https://example.com/videos/design-tools.mp4	/images/course-1.jpg	YouTube	Introduction to Design Tools	31	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	3
72	2400	https://example.com/videos/wireframing.mp4	/images/course-1.jpg	YouTube	Wireframing Basics	32	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	1
73	2600	https://example.com/videos/prototyping.mp4	/images/course-1.jpg	YouTube	Prototyping Techniques	32	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	2
74	2800	https://example.com/videos/accessibility.mp4	/images/course-1.jpg	YouTube	Introduction to Accessibility	33	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	1
75	3000	https://example.com/videos/usability.mp4	/images/course-1.jpg	YouTube	Usability Best Practices	33	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	2
76	1800	https://example.com/videos/flutter-intro.mp4	/images/course-1.jpg	YouTube	What is Flutter?	34	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	1
77	2000	https://example.com/videos/flutter-setup.mp4	/images/course-1.jpg	YouTube	Setting up Flutter	34	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	2
78	2200	https://example.com/videos/flutter-widgets.mp4	/images/course-1.jpg	YouTube	Understanding Flutter Widgets	34	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	3
79	2400	https://example.com/videos/state-management.mp4	/images/course-1.jpg	YouTube	Introduction to State Management	35	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	1
80	2600	https://example.com/videos/provider.mp4	/images/course-1.jpg	YouTube	State Management with Provider	35	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	2
81	2800	https://example.com/videos/navigation-intro.mp4	/images/course-1.jpg	YouTube	Introduction to Navigation	36	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	1
82	3000	https://example.com/videos/routing.mp4	/images/course-1.jpg	YouTube	Routing in Flutter	36	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	2
83	1800	https://example.com/videos/cybersecurity-intro.mp4	/images/course-1.jpg	YouTube	What is Cybersecurity?	37	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	1
84	2000	https://example.com/videos/cybersecurity-threats.mp4	/images/course-1.jpg	YouTube	Understanding Cybersecurity Threats	37	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	2
85	2200	https://example.com/videos/cybersecurity-tools.mp4	/images/course-1.jpg	YouTube	Cybersecurity Tools and Techniques	37	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	3
86	2400	https://example.com/videos/network-security.mp4	/images/course-1.jpg	YouTube	Introduction to Network Security	38	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	1
87	2600	https://example.com/videos/firewalls.mp4	/images/course-1.jpg	YouTube	Understanding Firewalls	38	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	2
88	2800	https://example.com/videos/ethical-hacking.mp4	/images/course-1.jpg	YouTube	Introduction to Ethical Hacking	39	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	1
89	3000	https://example.com/videos/hacking-tools.mp4	/images/course-1.jpg	YouTube	Hacking Tools and Techniques	39	\N	\N	\N	\N	2025-05-04 07:18:03.632+00	2025-05-04 07:18:03.632+00	2
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: coursity_user
--

COPY public.migrations (id, "timestamp", name) FROM stdin;
2	1744993757904	UPDATETIMESTAMP1744993757904
3	1745067993223	ALLOWDELETEDATNULL1745067993223
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: coursity_user
--

COPY public.users (id, full_name, email, password, role, created_by, updated_by, deleted_by, deleted_at, updated_at, created_at, clerk_user_id, image_url) FROM stdin;
2	Smash	Smash@gmail.com	\N	instructor	\N	\N	\N	\N	2025-04-23 14:41:49.467889+00	2025-04-23 14:41:47.272758+00	2	
1	Jonh	john@gmail.com	\N	instructor	\N	\N	\N	\N	2025-04-23 14:41:49.467889+00	2025-04-23 14:41:47.272758+00	1	
65	Quß╗æc C╞░ß╗¥ng B├╣i	buicuong13031998@gmail.com	\N	student	\N	\N	\N	\N	2025-04-23 14:41:49.467889+00	2025-04-23 14:41:47.272758+00	user_2w8Nao7MhJrDY5r0xO1RM3AXS5J	https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18ydzhOYW5xd1BXTHNTS1hLcXZIcFI1NHloRTUifQ
\.


--
-- Name: chapter_complete_id_seq; Type: SEQUENCE SET; Schema: public; Owner: coursity_user
--

SELECT pg_catalog.setval('public.chapter_complete_id_seq', 21, true);


--
-- Name: chapter_progress_id_seq; Type: SEQUENCE SET; Schema: public; Owner: coursity_user
--

SELECT pg_catalog.setval('public.chapter_progress_id_seq', 1, false);


--
-- Name: chapters_id_seq; Type: SEQUENCE SET; Schema: public; Owner: coursity_user
--

SELECT pg_catalog.setval('public.chapters_id_seq', 4, true);


--
-- Name: course_progress_id_seq; Type: SEQUENCE SET; Schema: public; Owner: coursity_user
--

SELECT pg_catalog.setval('public.course_progress_id_seq', 33, true);


--
-- Name: courses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: coursity_user
--

SELECT pg_catalog.setval('public.courses_id_seq', 1, false);


--
-- Name: enrollments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: coursity_user
--

SELECT pg_catalog.setval('public.enrollments_id_seq', 6, true);


--
-- Name: files_id_seq; Type: SEQUENCE SET; Schema: public; Owner: coursity_user
--

SELECT pg_catalog.setval('public.files_id_seq', 9, true);


--
-- Name: lesson_complete_id_seq; Type: SEQUENCE SET; Schema: public; Owner: coursity_user
--

SELECT pg_catalog.setval('public.lesson_complete_id_seq', 30, true);


--
-- Name: lessons_id_seq; Type: SEQUENCE SET; Schema: public; Owner: coursity_user
--

SELECT pg_catalog.setval('public.lessons_id_seq', 1, false);


--
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: coursity_user
--

SELECT pg_catalog.setval('public.migrations_id_seq', 3, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: coursity_user
--

SELECT pg_catalog.setval('public.users_id_seq', 65, true);


--
-- Name: lesson_complete PK_170eb829c83d2f120ce07b4b600; Type: CONSTRAINT; Schema: public; Owner: coursity_user
--

ALTER TABLE ONLY public.lesson_complete
    ADD CONSTRAINT "PK_170eb829c83d2f120ce07b4b600" PRIMARY KEY (id);


--
-- Name: courses PK_3f70a487cc718ad8eda4e6d58c9; Type: CONSTRAINT; Schema: public; Owner: coursity_user
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT "PK_3f70a487cc718ad8eda4e6d58c9" PRIMARY KEY (id);


--
-- Name: files PK_6c16b9093a142e0e7613b04a3d9; Type: CONSTRAINT; Schema: public; Owner: coursity_user
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY (id);


--
-- Name: chapter_progress PK_7276d733f4fd2d78a9b2955fd9b; Type: CONSTRAINT; Schema: public; Owner: coursity_user
--

ALTER TABLE ONLY public.chapter_progress
    ADD CONSTRAINT "PK_7276d733f4fd2d78a9b2955fd9b" PRIMARY KEY (id);


--
-- Name: enrollments PK_7c0f752f9fb68bf6ed7367ab00f; Type: CONSTRAINT; Schema: public; Owner: coursity_user
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT "PK_7c0f752f9fb68bf6ed7367ab00f" PRIMARY KEY (id);


--
-- Name: migrations PK_8c82d7f526340ab734260ea46be; Type: CONSTRAINT; Schema: public; Owner: coursity_user
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY (id);


--
-- Name: chapter_complete PK_95e2814fb9c8767337863af72a9; Type: CONSTRAINT; Schema: public; Owner: coursity_user
--

ALTER TABLE ONLY public.chapter_complete
    ADD CONSTRAINT "PK_95e2814fb9c8767337863af72a9" PRIMARY KEY (id);


--
-- Name: lessons PK_9b9a8d455cac672d262d7275730; Type: CONSTRAINT; Schema: public; Owner: coursity_user
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT "PK_9b9a8d455cac672d262d7275730" PRIMARY KEY (id);


--
-- Name: chapters PK_a2bbdbb4bdc786fe0cb0fcfc4a0; Type: CONSTRAINT; Schema: public; Owner: coursity_user
--

ALTER TABLE ONLY public.chapters
    ADD CONSTRAINT "PK_a2bbdbb4bdc786fe0cb0fcfc4a0" PRIMARY KEY (id);


--
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: coursity_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- Name: course_progress PK_eadd1b31d44023e533eb847c4f7; Type: CONSTRAINT; Schema: public; Owner: coursity_user
--

ALTER TABLE ONLY public.course_progress
    ADD CONSTRAINT "PK_eadd1b31d44023e533eb847c4f7" PRIMARY KEY (id);


--
-- Name: lesson_complete UQ_07f91c4170a55d28a01351ad26d; Type: CONSTRAINT; Schema: public; Owner: coursity_user
--

ALTER TABLE ONLY public.lesson_complete
    ADD CONSTRAINT "UQ_07f91c4170a55d28a01351ad26d" UNIQUE (user_id, lesson_id);


--
-- Name: files UQ_134735cc45672b90b366c20dc35; Type: CONSTRAINT; Schema: public; Owner: coursity_user
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT "UQ_134735cc45672b90b366c20dc35" UNIQUE (filename);


--
-- Name: chapter_complete UQ_242990c68dbc7703db6f34e66ab; Type: CONSTRAINT; Schema: public; Owner: coursity_user
--

ALTER TABLE ONLY public.chapter_complete
    ADD CONSTRAINT "UQ_242990c68dbc7703db6f34e66ab" UNIQUE (user_id, chapter_id);


--
-- Name: course_progress UQ_578f66595af7b446be0f5464685; Type: CONSTRAINT; Schema: public; Owner: coursity_user
--

ALTER TABLE ONLY public.course_progress
    ADD CONSTRAINT "UQ_578f66595af7b446be0f5464685" UNIQUE (user_id, course_id);


--
-- Name: users UQ_69b38acaab6341c8769a0058721; Type: CONSTRAINT; Schema: public; Owner: coursity_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_69b38acaab6341c8769a0058721" UNIQUE (clerk_user_id);


--
-- Name: users UQ_97672ac88f789774dd47f7c8be3; Type: CONSTRAINT; Schema: public; Owner: coursity_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);


--
-- Name: chapter_progress UQ_d49a505d72f84acb0909348d5cc; Type: CONSTRAINT; Schema: public; Owner: coursity_user
--

ALTER TABLE ONLY public.chapter_progress
    ADD CONSTRAINT "UQ_d49a505d72f84acb0909348d5cc" UNIQUE (user_id, chapter_id);


--
-- Name: lesson_complete FK_11118d4b7ccbddb04146e9011d3; Type: FK CONSTRAINT; Schema: public; Owner: coursity_user
--

ALTER TABLE ONLY public.lesson_complete
    ADD CONSTRAINT "FK_11118d4b7ccbddb04146e9011d3" FOREIGN KEY (lesson_id) REFERENCES public.lessons(id);


--
-- Name: chapter_progress FK_350dd97812aa0f321f212585fd7; Type: FK CONSTRAINT; Schema: public; Owner: coursity_user
--

ALTER TABLE ONLY public.chapter_progress
    ADD CONSTRAINT "FK_350dd97812aa0f321f212585fd7" FOREIGN KEY (chapter_id) REFERENCES public.chapters(id);


--
-- Name: chapter_progress FK_3796b7939c2bb68b3355b079ca8; Type: FK CONSTRAINT; Schema: public; Owner: coursity_user
--

ALTER TABLE ONLY public.chapter_progress
    ADD CONSTRAINT "FK_3796b7939c2bb68b3355b079ca8" FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: lesson_complete FK_39d6c2aa47d50293d7f6ccfa584; Type: FK CONSTRAINT; Schema: public; Owner: coursity_user
--

ALTER TABLE ONLY public.lesson_complete
    ADD CONSTRAINT "FK_39d6c2aa47d50293d7f6ccfa584" FOREIGN KEY (course_id) REFERENCES public.courses(id);


--
-- Name: lessons FK_424ea916afdf352278a064dabbd; Type: FK CONSTRAINT; Schema: public; Owner: coursity_user
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT "FK_424ea916afdf352278a064dabbd" FOREIGN KEY (chapter_id) REFERENCES public.chapters(id);


--
-- Name: course_progress FK_468b14b39d8428b77d8630bd5cc; Type: FK CONSTRAINT; Schema: public; Owner: coursity_user
--

ALTER TABLE ONLY public.course_progress
    ADD CONSTRAINT "FK_468b14b39d8428b77d8630bd5cc" FOREIGN KEY (course_id) REFERENCES public.courses(id);


--
-- Name: chapter_progress FK_4cf3b9827813e536ead90056d46; Type: FK CONSTRAINT; Schema: public; Owner: coursity_user
--

ALTER TABLE ONLY public.chapter_progress
    ADD CONSTRAINT "FK_4cf3b9827813e536ead90056d46" FOREIGN KEY (course_id) REFERENCES public.courses(id);


--
-- Name: courses FK_4fdc83dd6b261101401ec259342; Type: FK CONSTRAINT; Schema: public; Owner: coursity_user
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT "FK_4fdc83dd6b261101401ec259342" FOREIGN KEY (instructor_id) REFERENCES public.users(id);


--
-- Name: lesson_complete FK_5a8395d0554fd030269d9105ed3; Type: FK CONSTRAINT; Schema: public; Owner: coursity_user
--

ALTER TABLE ONLY public.lesson_complete
    ADD CONSTRAINT "FK_5a8395d0554fd030269d9105ed3" FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: chapter_complete FK_6f4695925a1919b41f373a49b64; Type: FK CONSTRAINT; Schema: public; Owner: coursity_user
--

ALTER TABLE ONLY public.chapter_complete
    ADD CONSTRAINT "FK_6f4695925a1919b41f373a49b64" FOREIGN KEY (course_id) REFERENCES public.courses(id);


--
-- Name: course_progress FK_85392161b4c16580b3a7d937d94; Type: FK CONSTRAINT; Schema: public; Owner: coursity_user
--

ALTER TABLE ONLY public.course_progress
    ADD CONSTRAINT "FK_85392161b4c16580b3a7d937d94" FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: chapters FK_9909a69a63f1d064b42ef35ab04; Type: FK CONSTRAINT; Schema: public; Owner: coursity_user
--

ALTER TABLE ONLY public.chapters
    ADD CONSTRAINT "FK_9909a69a63f1d064b42ef35ab04" FOREIGN KEY (course_id) REFERENCES public.courses(id);


--
-- Name: lesson_complete FK_b269bb983853eaae67d9f9f379c; Type: FK CONSTRAINT; Schema: public; Owner: coursity_user
--

ALTER TABLE ONLY public.lesson_complete
    ADD CONSTRAINT "FK_b269bb983853eaae67d9f9f379c" FOREIGN KEY (chapter_id) REFERENCES public.chapters(id);


--
-- Name: enrollments FK_b79d0bf01779fdf9cfb6b092af3; Type: FK CONSTRAINT; Schema: public; Owner: coursity_user
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT "FK_b79d0bf01779fdf9cfb6b092af3" FOREIGN KEY (course_id) REFERENCES public.courses(id);


--
-- Name: chapter_complete FK_eaba6aa7aff9f217322f18b2f03; Type: FK CONSTRAINT; Schema: public; Owner: coursity_user
--

ALTER TABLE ONLY public.chapter_complete
    ADD CONSTRAINT "FK_eaba6aa7aff9f217322f18b2f03" FOREIGN KEY (chapter_id) REFERENCES public.chapters(id);


--
-- Name: chapter_complete FK_f4c0647d9495a85cd4a0812bb25; Type: FK CONSTRAINT; Schema: public; Owner: coursity_user
--

ALTER TABLE ONLY public.chapter_complete
    ADD CONSTRAINT "FK_f4c0647d9495a85cd4a0812bb25" FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: enrollments FK_ff997f5a39cd24a491b9aca45c9; Type: FK CONSTRAINT; Schema: public; Owner: coursity_user
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT "FK_ff997f5a39cd24a491b9aca45c9" FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

