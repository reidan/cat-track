--
-- PostgreSQL database dump
--

-- Dumped from database version 16.6 (Debian 16.6-1.pgdg120+1)
-- Dumped by pg_dump version 16.3

-- Started on 2025-02-12 20:48:05 PST

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: dkr_cat_track_user
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO dkr_cat_track_user;

--
-- TOC entry 3397 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: dkr_cat_track_user
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 216 (class 1259 OID 16399)
-- Name: cats; Type: TABLE; Schema: public; Owner: dkr_cat_track_user
--

CREATE TABLE public.cats (
    id integer NOT NULL,
    name text NOT NULL,
    birthday date NOT NULL,
    calorie_goal integer DEFAULT 0,
    photo text
);


ALTER TABLE public.cats OWNER TO dkr_cat_track_user;

--
-- TOC entry 215 (class 1259 OID 16398)
-- Name: cats_id_seq; Type: SEQUENCE; Schema: public; Owner: dkr_cat_track_user
--

CREATE SEQUENCE public.cats_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cats_id_seq OWNER TO dkr_cat_track_user;

--
-- TOC entry 3398 (class 0 OID 0)
-- Dependencies: 215
-- Name: cats_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dkr_cat_track_user
--

ALTER SEQUENCE public.cats_id_seq OWNED BY public.cats.id;


--
-- TOC entry 220 (class 1259 OID 16418)
-- Name: food_logs; Type: TABLE; Schema: public; Owner: dkr_cat_track_user
--

CREATE TABLE public.food_logs (
    id integer NOT NULL,
    cat_id integer,
    food_id integer,
    "timestamp" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    quantity numeric NOT NULL,
    calories numeric NOT NULL
);


ALTER TABLE public.food_logs OWNER TO dkr_cat_track_user;

--
-- TOC entry 219 (class 1259 OID 16417)
-- Name: food_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: dkr_cat_track_user
--

CREATE SEQUENCE public.food_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.food_logs_id_seq OWNER TO dkr_cat_track_user;

--
-- TOC entry 3399 (class 0 OID 0)
-- Dependencies: 219
-- Name: food_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dkr_cat_track_user
--

ALTER SEQUENCE public.food_logs_id_seq OWNED BY public.food_logs.id;


--
-- TOC entry 218 (class 1259 OID 16409)
-- Name: foods; Type: TABLE; Schema: public; Owner: dkr_cat_track_user
--

CREATE TABLE public.foods (
    id integer NOT NULL,
    name text NOT NULL,
    unit text NOT NULL,
    calories_per_unit numeric NOT NULL
);


ALTER TABLE public.foods OWNER TO dkr_cat_track_user;

--
-- TOC entry 217 (class 1259 OID 16408)
-- Name: foods_id_seq; Type: SEQUENCE; Schema: public; Owner: dkr_cat_track_user
--

CREATE SEQUENCE public.foods_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.foods_id_seq OWNER TO dkr_cat_track_user;

--
-- TOC entry 3400 (class 0 OID 0)
-- Dependencies: 217
-- Name: foods_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dkr_cat_track_user
--

ALTER SEQUENCE public.foods_id_seq OWNED BY public.foods.id;


--
-- TOC entry 222 (class 1259 OID 16445)
-- Name: users; Type: TABLE; Schema: public; Owner: dkr_cat_track_user
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    password text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.users OWNER TO dkr_cat_track_user;

--
-- TOC entry 221 (class 1259 OID 16444)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: dkr_cat_track_user
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO dkr_cat_track_user;

--
-- TOC entry 3401 (class 0 OID 0)
-- Dependencies: 221
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dkr_cat_track_user
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 3222 (class 2604 OID 16402)
-- Name: cats id; Type: DEFAULT; Schema: public; Owner: dkr_cat_track_user
--

ALTER TABLE ONLY public.cats ALTER COLUMN id SET DEFAULT nextval('public.cats_id_seq'::regclass);


--
-- TOC entry 3225 (class 2604 OID 16421)
-- Name: food_logs id; Type: DEFAULT; Schema: public; Owner: dkr_cat_track_user
--

ALTER TABLE ONLY public.food_logs ALTER COLUMN id SET DEFAULT nextval('public.food_logs_id_seq'::regclass);


--
-- TOC entry 3224 (class 2604 OID 16412)
-- Name: foods id; Type: DEFAULT; Schema: public; Owner: dkr_cat_track_user
--

ALTER TABLE ONLY public.foods ALTER COLUMN id SET DEFAULT nextval('public.foods_id_seq'::regclass);


--
-- TOC entry 3227 (class 2604 OID 16448)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: dkr_cat_track_user
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 3385 (class 0 OID 16399)
-- Dependencies: 216
-- Data for Name: cats; Type: TABLE DATA; Schema: public; Owner: dkr_cat_track_user
--

COPY public.cats (id, name, birthday, calorie_goal, photo) FROM stdin;
1	Slim Shady	2021-03-10	282	\N
2	Rosa	2021-08-04	230	\N
3	Coco	2023-11-08	270	\N
\.


--
-- TOC entry 3389 (class 0 OID 16418)
-- Dependencies: 220
-- Data for Name: food_logs; Type: TABLE DATA; Schema: public; Owner: dkr_cat_track_user
--

COPY public.food_logs (id, cat_id, food_id, "timestamp", quantity, calories) FROM stdin;
19	3	2	2025-02-08 06:00:41.566817+00	4	15.692
24	1	2	2025-02-05 06:54:26.985+00	21	82.383
25	1	2	2025-02-05 06:54:31.618+00	7	27.461
26	1	2	2025-02-05 06:54:35.106+00	9	35.307
27	1	2	2025-02-05 06:54:38.643+00	17	66.691
28	1	4	2025-02-05 06:54:44.798+00	5	8
29	2	2	2025-02-05 06:56:10.501+00	7	27.461
30	2	2	2025-02-05 06:56:13.95+00	3	11.769
31	2	2	2025-02-05 06:56:16.678+00	11	43.153
32	2	2	2025-02-05 06:56:19.436+00	5	19.615000000000002
33	2	7	2025-02-05 06:56:27.338+00	31	24.025000000000002
34	2	9	2025-02-05 06:57:39.459+00	39	41.262
35	2	8	2025-02-05 06:57:45.765+00	26	28.366
36	2	4	2025-02-05 06:58:15.166+00	10	16
37	3	7	2025-02-05 06:58:42.253+00	1	0.775
38	3	9	2025-02-05 06:58:51.767+00	42	44.436
39	3	3	2025-02-05 06:58:56.62+00	5	10
40	3	2	2025-02-05 06:59:02.526+00	5	19.615000000000002
41	3	2	2025-02-05 06:59:05.452+00	12	47.076
42	3	2	2025-02-05 06:59:10.356+00	7	27.461
43	3	2	2025-02-05 06:59:41.039+00	15	58.845
44	2	2	2025-02-05 18:49:25.72+00	9	35.307
45	3	2	2025-02-05 18:49:41.543+00	14	54.922
46	1	2	2025-02-06 07:44:03.652+00	60	235.38
47	1	4	2025-02-06 07:44:09.839+00	10	16
48	3	2	2025-02-06 07:44:17.497+00	45	176.535
49	3	8	2025-02-06 07:44:23.637+00	45	49.095
50	2	8	2025-02-06 07:44:30.931+00	45	49.095
51	2	2	2025-02-06 07:44:36.203+00	40	156.92000000000002
52	1	2	2025-02-06 07:44:58.884+00	5	19.615000000000002
53	1	2	2025-02-06 07:45:25.982+00	1	3.923
54	1	4	2025-02-06 07:45:32.959+00	1	1.6
55	2	2	2025-02-06 07:45:57.303+00	5	19.615000000000002
56	3	2	2025-02-06 07:47:46.904+00	8	31.384
57	1	2	2025-02-06 20:58:23.036+00	23	90.229
58	2	2	2025-02-06 20:58:27.828+00	7	27.461
59	3	2	2025-02-06 20:58:34.11+00	17	66.691
60	1	4	2025-02-06 22:14:56.585+00	1	1.6
61	1	2	2025-02-06 22:15:12.431+00	11	43.153
62	2	2	2025-02-06 22:15:29.61+00	14	54.922
63	2	7	2025-02-06 22:16:38.808+00	27	20.925
64	3	7	2025-02-06 22:16:44.739+00	43	33.325
65	3	2	2025-02-06 22:16:50.872+00	16	62.768
66	2	10	2025-02-07 01:19:56.042+00	31	24.738
67	2	2	2025-02-07 01:20:05.866+00	13	50.999
68	2	3	2025-02-07 01:20:12.291+00	5	10
69	1	2	2025-02-07 01:23:27.625+00	7	27.461
70	3	10	2025-02-07 01:48:08.626+00	4	3.192
71	1	2	2025-02-07 05:17:37.016+00	21	82.383
72	3	2	2025-02-07 05:18:31.08+00	24	94.152
73	3	7	2025-02-07 05:20:15.322+00	43	33.325
74	2	7	2025-02-07 05:21:02.12+00	37	28.675
75	2	2	2025-02-07 05:21:57.081+00	16	62.768
79	3	11	2025-02-08 17:49:25.203604+00	0.6	7.8
80	2	11	2025-02-08 17:49:34.85195+00	0.4	5.2
1	2	3	2025-02-08 06:06:06.91257+00	5	10
2	2	6	2025-02-08 06:06:49.133176+00	40	51.6
3	2	2	2025-02-08 06:07:01.529534+00	5	19.615000000000002
4	3	2	2025-02-08 06:07:18.924149+00	12	47.076
5	3	5	2025-02-08 06:07:37.631323+00	30	24.99
6	1	2	2025-02-08 06:07:53.84619+00	6	23.538
7	1	2	2025-02-08 06:07:59.352917+00	20	78.46000000000001
8	3	2	2025-02-08 06:08:10.752415+00	12	47.076
9	3	5	2025-02-08 06:08:34.506681+00	35	29.154999999999998
10	2	2	2025-02-08 06:08:44.651171+00	13	50.999
11	2	5	2025-02-08 06:08:56.187468+00	43	35.818999999999996
12	3	2	2025-02-08 06:09:16.519531+00	20	78.46000000000001
13	1	2	2025-02-08 06:09:26.245179+00	28	109.844
14	2	3	2025-02-08 06:09:41.651562+00	5	10
15	2	2	2025-02-08 06:09:51.514216+00	10	39.230000000000004
16	3	5	2025-02-08 06:00:18.714693+00	15	12.495
17	3	6	2025-02-08 06:00:30.340643+00	14	18.060000000000002
18	3	2	2025-02-08 06:00:37.944295+00	9	35.307
20	2	2	2025-02-08 06:00:56.080449+00	10	39.230000000000004
21	2	6	2025-02-08 06:01:04.736281+00	25	32.25
22	1	2	2025-02-08 06:01:18.160219+00	15	58.845
81	1	2	2025-02-08 18:35:27.164448+00	14	54.922
83	2	2	2025-02-08 18:35:35.468747+00	22	86.306
84	3	2	2025-02-08 18:35:39.902566+00	38	149.074
85	1	2	2025-02-08 21:53:51.266473+00	11	43.153
87	1	4	2025-02-08 22:01:21.618784+00	5	8
88	3	2	2025-02-08 22:01:29.125229+00	10	39.230000000000004
89	2	2	2025-02-08 22:01:43.134173+00	20	78.46000000000001
90	3	12	2025-02-08 22:02:48.156173+00	20	13.5
91	2	12	2025-02-08 22:02:56.268453+00	40	27
95	1	2	2025-02-09 06:47:17.692001+00	22	86.306
96	1	4	2025-02-09 06:47:24.302523+00	3	4.800000000000001
97	3	2	2025-02-09 06:49:56.870459+00	12	47.076
98	3	12	2025-02-09 06:51:21.099161+00	10	6.75
101	2	12	2025-02-09 06:55:51.10237+00	8	5.4
104	2	2	2025-02-09 17:42:49.729059+00	15	58.845
106	2	11	2025-02-09 17:43:14.87587+00	0.2	2.6
86	1	2	2025-02-08 22:01:14.629889+00	25	98.075
105	2	6	2025-02-09 17:42:59.697644+00	29	37.410000000000004
103	3	2	2025-02-09 17:42:44.816702+00	17	66.691
102	1	2	2025-02-09 17:42:35.81471+00	15	58.845
100	2	2	2025-02-09 06:55:45.317432+00	4	15.692
99	2	6	2025-02-09 06:52:39.377322+00	28	36.120000000000005
110	2	11	2025-02-09 21:42:20.968716+00	0.4	5.2
108	3	2	2025-02-09 21:42:02.73402+00	5	19.615000000000002
109	2	2	2025-02-09 21:42:09.20787+00	15	58.845
107	1	2	2025-02-09 21:41:58.180917+00	11	43.153
112	1	2	2025-02-10 05:04:33.772212+00	30	117.69
113	3	2	2025-02-10 05:04:39.555607+00	20	78.46000000000001
114	2	2	2025-02-10 05:04:45.65407+00	15	58.845
111	1	2	2025-02-09 21:48:51.511168+00	10	39.230000000000004
117	3	2	2025-02-10 05:07:22.489208+00	9	35.307
118	1	4	2025-02-10 05:43:58.884147+00	5	8
116	3	13	2025-02-10 05:05:41.251793+00	34	42.228
115	2	13	2025-02-10 05:05:36.037289+00	41	50.922
119	1	2	2025-02-10 17:07:05.174196+00	30	117.69
120	3	2	2025-02-10 17:07:11.148069+00	30	117.69
122	2	11	2025-02-10 17:07:22.734927+00	0.4	5.2
123	1	2	2025-02-11 00:26:56.457705+00	20	78.46000000000001
124	2	2	2025-02-11 00:27:03.99309+00	11	43.153
126	3	2	2025-02-11 00:27:28.868115+00	10	39.230000000000004
127	3	14	2025-02-11 00:29:18.380216+00	30	24.240000000000002
121	2	2	2025-02-10 17:07:15.682305+00	20	78.46000000000001
129	1	4	2025-02-11 05:27:00.963205+00	8	12.8
130	3	14	2025-02-11 05:28:02.397858+00	51	41.208000000000006
131	3	2	2025-02-11 05:28:43.128176+00	16	62.768
134	2	14	2025-02-11 05:31:11.612873+00	12	9.696000000000002
132	2	13	2025-02-11 05:30:00.457162+00	20	24.84
133	2	2	2025-02-11 05:30:52.104474+00	13	50.999
128	1	2	2025-02-11 05:26:56.196786+00	16	62.768
136	3	14	2025-02-11 16:40:03.720922+00	40	32.32
137	3	2	2025-02-11 16:40:25.974279+00	10	39.230000000000004
140	2	14	2025-02-11 16:44:42.707333+00	13	10.504000000000001
139	2	2	2025-02-11 16:44:08.688569+00	5	19.615000000000002
138	2	15	2025-02-11 16:43:50.900204+00	8	10.24
141	1	2	2025-02-11 21:02:25.354874+00	28	109.844
142	1	2	2025-02-11 21:49:40.484421+00	15	58.845
143	3	14	2025-02-11 21:51:21.574032+00	41	33.128
144	3	2	2025-02-11 21:51:37.091938+00	13	50.999
146	2	2	2025-02-11 21:53:01.405318+00	10	39.230000000000004
145	2	14	2025-02-11 21:52:48.604121+00	30	24.240000000000002
147	3	2	2025-02-12 04:00:52.789577+00	17	66.691
148	3	14	2025-02-12 04:01:48.981765+00	30	24.240000000000002
152	2	3	2025-02-12 04:13:27.883981+00	10	20
150	2	13	2025-02-12 04:04:40.328554+00	30	37.26
149	2	2	2025-02-12 04:03:18.693428+00	8	31.384
153	3	13	2025-02-12 04:27:36.080019+00	15	18.63
151	1	2	2025-02-12 04:07:09.81905+00	23	90.229
155	2	13	2025-02-12 06:05:42.544818+00	35	43.47
156	1	2	2025-02-12 06:06:05.385197+00	6	23.538
158	2	3	2025-02-12 06:16:39.853085+00	5	10
154	1	4	2025-02-12 04:29:38.582632+00	9	14.4
159	3	3	2025-02-12 06:23:56.072964+00	5	10
157	3	2	2025-02-12 06:06:17.444874+00	3	11.769
160	1	2	2025-02-12 21:47:39.081815+00	14	54.922
161	1	2	2025-02-12 21:48:48.567509+00	30	117.69
162	3	2	2025-02-12 21:48:53.516292+00	17	66.691
163	3	2	2025-02-12 21:50:34.011362+00	13	50.999
164	3	14	2025-02-12 21:51:14.486669+00	30	24.240000000000002
166	2	13	2025-02-12 21:53:06.138095+00	25	31.05
167	2	17	2025-02-13 00:27:23.130214+00	45	40.14
165	2	2	2025-02-12 21:52:06.433612+00	4	15.692
125	2	13	2025-02-11 00:27:17.010975+00	41	50.922
168	2	3	2025-02-13 02:19:59.373519+00	3	6
\.


--
-- TOC entry 3387 (class 0 OID 16409)
-- Dependencies: 218
-- Data for Name: foods; Type: TABLE DATA; Schema: public; Owner: dkr_cat_track_user
--

COPY public.foods (id, name, unit, calories_per_unit) FROM stdin;
1	RC - Rabbit Vet	gram	1.007
2	RC - Vet Dry	gram	3.923
4	RC - HP Treats	piece	1.6
3	Temptations - Beef	piece	2
5	FF - Turkey Cuts and Gravy	gram	0.833
6	BW - Salmon	gram	1.29
7	FF - Salmon Gravy	gram	0.775
8	FF - Pate	gram	1.091
9	FF - Chunky Chicken	gram	1.058
10	FF - Chicken Gravy	gram	0.798
11	TC - Broths	pouch	13
12	Weruva - tuna gravy	gram	0.675
13	Wellness - Beef and Chicken	gram	1.242
15	BW - Chicken	gram	1.28
16	Friskies- chicken gravy	gram	0.965
17	Wellness - Turkey Salmon	gram	0.892
14	Friskies- turkey chunky gravy	gram	0.808
\.


--
-- TOC entry 3391 (class 0 OID 16445)
-- Dependencies: 222
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: dkr_cat_track_user
--

COPY public.users (id, username, password, created_at) FROM stdin;
\.


--
-- TOC entry 3402 (class 0 OID 0)
-- Dependencies: 215
-- Name: cats_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dkr_cat_track_user
--

SELECT pg_catalog.setval('public.cats_id_seq', 3, true);


--
-- TOC entry 3403 (class 0 OID 0)
-- Dependencies: 219
-- Name: food_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dkr_cat_track_user
--

SELECT pg_catalog.setval('public.food_logs_id_seq', 170, true);


--
-- TOC entry 3404 (class 0 OID 0)
-- Dependencies: 217
-- Name: foods_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dkr_cat_track_user
--

SELECT pg_catalog.setval('public.foods_id_seq', 17, true);


--
-- TOC entry 3405 (class 0 OID 0)
-- Dependencies: 221
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dkr_cat_track_user
--

SELECT pg_catalog.setval('public.users_id_seq', 1, false);


--
-- TOC entry 3230 (class 2606 OID 16407)
-- Name: cats cats_pkey; Type: CONSTRAINT; Schema: public; Owner: dkr_cat_track_user
--

ALTER TABLE ONLY public.cats
    ADD CONSTRAINT cats_pkey PRIMARY KEY (id);


--
-- TOC entry 3234 (class 2606 OID 16426)
-- Name: food_logs food_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: dkr_cat_track_user
--

ALTER TABLE ONLY public.food_logs
    ADD CONSTRAINT food_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 3232 (class 2606 OID 16416)
-- Name: foods foods_pkey; Type: CONSTRAINT; Schema: public; Owner: dkr_cat_track_user
--

ALTER TABLE ONLY public.foods
    ADD CONSTRAINT foods_pkey PRIMARY KEY (id);


--
-- TOC entry 3236 (class 2606 OID 16453)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: dkr_cat_track_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3238 (class 2606 OID 16455)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: dkr_cat_track_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 3239 (class 2606 OID 16427)
-- Name: food_logs food_logs_cat_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dkr_cat_track_user
--

ALTER TABLE ONLY public.food_logs
    ADD CONSTRAINT food_logs_cat_id_fkey FOREIGN KEY (cat_id) REFERENCES public.cats(id) ON DELETE CASCADE;


--
-- TOC entry 3240 (class 2606 OID 16432)
-- Name: food_logs food_logs_food_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dkr_cat_track_user
--

ALTER TABLE ONLY public.food_logs
    ADD CONSTRAINT food_logs_food_id_fkey FOREIGN KEY (food_id) REFERENCES public.foods(id) ON DELETE CASCADE;


-- Completed on 2025-02-12 20:48:09 PST

--
-- PostgreSQL database dump complete
--

