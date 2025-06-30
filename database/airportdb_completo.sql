--
-- PostgreSQL database dump
--

-- Dumped from database version 14.18 (Homebrew)
-- Dumped by pg_dump version 14.18 (Homebrew)

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: allocations; Type: TABLE; Schema: public; Owner: murilo
--

CREATE TABLE public.allocations (
    id integer NOT NULL,
    flight_id integer NOT NULL,
    resource_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    released_at timestamp with time zone
);


ALTER TABLE public.allocations OWNER TO murilo;

--
-- Name: allocations_id_seq; Type: SEQUENCE; Schema: public; Owner: murilo
--

CREATE SEQUENCE public.allocations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.allocations_id_seq OWNER TO murilo;

--
-- Name: allocations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: murilo
--

ALTER SEQUENCE public.allocations_id_seq OWNED BY public.allocations.id;


--
-- Name: flights; Type: TABLE; Schema: public; Owner: murilo
--

CREATE TABLE public.flights (
    id integer NOT NULL,
    number character varying(20) NOT NULL,
    origin character varying(50) NOT NULL,
    destination character varying(50) NOT NULL,
    scheduled_at timestamp with time zone NOT NULL,
    status character varying(50) DEFAULT 'scheduled'::character varying
);


ALTER TABLE public.flights OWNER TO murilo;

--
-- Name: flights_id_seq; Type: SEQUENCE; Schema: public; Owner: murilo
--

CREATE SEQUENCE public.flights_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.flights_id_seq OWNER TO murilo;

--
-- Name: flights_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: murilo
--

ALTER SEQUENCE public.flights_id_seq OWNED BY public.flights.id;


--
-- Name: gates; Type: TABLE; Schema: public; Owner: murilo
--

CREATE TABLE public.gates (
    id integer NOT NULL,
    code character varying(10) NOT NULL
);


ALTER TABLE public.gates OWNER TO murilo;

--
-- Name: gates_id_seq; Type: SEQUENCE; Schema: public; Owner: murilo
--

CREATE SEQUENCE public.gates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.gates_id_seq OWNER TO murilo;

--
-- Name: gates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: murilo
--

ALTER SEQUENCE public.gates_id_seq OWNED BY public.gates.id;


--
-- Name: resources; Type: TABLE; Schema: public; Owner: murilo
--

CREATE TABLE public.resources (
    id integer NOT NULL,
    code character varying(20) NOT NULL,
    type character varying(20) NOT NULL,
    CONSTRAINT resources_type_check CHECK (((type)::text = ANY ((ARRAY['gate'::character varying, 'runway'::character varying, 'vehicle'::character varying, 'hangar'::character varying, 'service'::character varying])::text[])))
);


ALTER TABLE public.resources OWNER TO murilo;

--
-- Name: resources_id_seq; Type: SEQUENCE; Schema: public; Owner: murilo
--

CREATE SEQUENCE public.resources_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.resources_id_seq OWNER TO murilo;

--
-- Name: resources_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: murilo
--

ALTER SEQUENCE public.resources_id_seq OWNED BY public.resources.id;


--
-- Name: allocations id; Type: DEFAULT; Schema: public; Owner: murilo
--

ALTER TABLE ONLY public.allocations ALTER COLUMN id SET DEFAULT nextval('public.allocations_id_seq'::regclass);


--
-- Name: flights id; Type: DEFAULT; Schema: public; Owner: murilo
--

ALTER TABLE ONLY public.flights ALTER COLUMN id SET DEFAULT nextval('public.flights_id_seq'::regclass);


--
-- Name: gates id; Type: DEFAULT; Schema: public; Owner: murilo
--

ALTER TABLE ONLY public.gates ALTER COLUMN id SET DEFAULT nextval('public.gates_id_seq'::regclass);


--
-- Name: resources id; Type: DEFAULT; Schema: public; Owner: murilo
--

ALTER TABLE ONLY public.resources ALTER COLUMN id SET DEFAULT nextval('public.resources_id_seq'::regclass);


--
-- Data for Name: allocations; Type: TABLE DATA; Schema: public; Owner: murilo
--

COPY public.allocations (id, flight_id, resource_id, created_at, released_at) FROM stdin;
15	11	18	2025-05-29 18:27:52.023206-03	2025-05-29 18:33:38.251152-03
13	11	5	2025-05-29 18:27:36.338329-03	2025-05-29 18:33:40.19119-03
14	11	5	2025-05-29 18:27:40.238653-03	2025-05-29 18:33:40.19119-03
9	9	9	2025-05-29 16:37:44.118924-03	2025-05-29 18:47:15.57823-03
16	9	19	2025-05-29 18:27:58.589349-03	2025-05-29 18:47:15.580791-03
22	9	5	2025-05-29 18:47:07.902916-03	2025-05-29 18:47:21.964101-03
19	11	10	2025-05-29 18:46:47.953511-03	2025-05-29 18:47:28.1287-03
21	11	18	2025-05-29 18:46:58.652712-03	2025-05-29 18:47:28.131143-03
17	11	7	2025-05-29 18:46:35.186806-03	2025-05-29 18:47:30.615675-03
18	11	7	2025-05-29 18:46:39.265657-03	2025-05-29 18:47:30.615675-03
20	11	15	2025-05-29 18:46:53.636167-03	2025-05-29 18:47:30.616928-03
1	6	1	2025-05-29 16:13:48.852349-03	2025-05-29 18:49:48.660306-03
2	6	1	2025-05-29 16:13:51.178827-03	2025-05-29 18:49:48.660306-03
3	6	16	2025-05-29 16:13:55.664743-03	2025-05-29 18:49:48.660306-03
4	6	16	2025-05-29 16:13:56.929216-03	2025-05-29 18:49:48.660306-03
5	6	2	2025-05-29 16:14:06.247871-03	2025-05-29 18:49:48.660306-03
6	5	3	2025-05-29 16:14:09.380209-03	2025-05-29 18:49:48.660306-03
7	6	13	2025-05-29 16:17:43.045911-03	2025-05-29 18:49:48.660306-03
8	10	6	2025-05-29 16:37:36.192875-03	2025-05-29 18:49:48.660306-03
10	8	14	2025-05-29 16:37:50.719297-03	2025-05-29 18:49:48.660306-03
11	7	17	2025-05-29 16:37:55.567377-03	2025-05-29 18:49:48.660306-03
12	4	4	2025-05-29 16:38:01.269105-03	2025-05-29 18:49:48.660306-03
27	11	9	2025-05-29 18:58:43.316834-03	2025-05-29 19:04:58.5561-03
25	11	16	2025-05-29 18:58:37.617108-03	2025-05-29 19:04:58.557865-03
23	11	1	2025-05-29 18:58:28.49382-03	2025-05-29 19:05:01.141863-03
24	11	1	2025-05-29 18:58:31.599435-03	2025-05-29 19:05:01.141863-03
26	11	13	2025-05-29 18:58:40.432133-03	2025-05-29 19:05:01.143971-03
29	11	9	2025-05-29 19:05:19.464858-03	2025-05-29 19:05:39.595759-03
31	11	16	2025-05-29 19:05:24.314088-03	2025-05-29 19:05:39.598579-03
32	11	1	2025-05-29 19:05:27.431023-03	2025-05-29 19:06:54.689051-03
33	11	1	2025-05-29 19:05:31.097149-03	2025-05-29 19:06:54.689051-03
28	11	6	2025-05-29 19:05:15.832648-03	2025-05-29 19:06:54.690645-03
30	11	13	2025-05-29 19:05:21.89908-03	2025-05-29 19:06:54.691328-03
35	11	9	2025-05-29 19:11:35.26941-03	2025-05-29 19:11:55.781631-03
37	11	16	2025-05-29 19:11:42.619517-03	2025-05-29 19:11:55.783874-03
38	11	1	2025-05-29 19:11:46.18888-03	2025-05-29 19:11:58.307166-03
34	11	6	2025-05-29 19:11:30.620189-03	2025-05-29 19:11:58.309294-03
36	11	13	2025-05-29 19:11:38.138318-03	2025-05-29 19:11:58.311316-03
40	11	1	2025-05-29 19:17:40.16758-03	2025-05-29 19:18:54.290311-03
41	11	1	2025-05-29 19:17:41.599597-03	2025-05-29 19:18:54.290311-03
42	11	1	2025-05-29 19:17:41.766993-03	2025-05-29 19:18:54.290311-03
43	11	1	2025-05-29 19:17:41.915558-03	2025-05-29 19:18:54.290311-03
44	11	1	2025-05-29 19:17:42.066018-03	2025-05-29 19:18:54.290311-03
45	11	1	2025-05-29 19:17:42.198979-03	2025-05-29 19:18:54.290311-03
46	11	1	2025-05-29 19:17:42.366738-03	2025-05-29 19:18:54.290311-03
47	11	1	2025-05-29 19:17:42.499061-03	2025-05-29 19:18:54.290311-03
48	11	1	2025-05-29 19:17:42.648818-03	2025-05-29 19:18:54.290311-03
49	11	1	2025-05-29 19:17:42.782151-03	2025-05-29 19:18:54.290311-03
50	11	1	2025-05-29 19:17:42.9484-03	2025-05-29 19:18:54.290311-03
51	11	1	2025-05-29 19:17:43.082399-03	2025-05-29 19:18:54.290311-03
52	11	2	2025-05-29 19:17:47.168874-03	2025-05-29 19:18:54.290311-03
39	11	6	2025-05-29 19:17:36.736167-03	2025-05-29 19:18:54.291995-03
53	9	3	2025-05-29 19:17:51.449338-03	2025-05-29 19:19:08.111292-03
54	9	3	2025-05-29 19:17:51.916408-03	2025-05-29 19:19:08.111292-03
55	9	3	2025-05-29 19:17:52.02957-03	2025-05-29 19:19:08.111292-03
56	9	3	2025-05-29 19:17:52.201206-03	2025-05-29 19:19:08.111292-03
57	11	1	2025-05-29 19:37:50.368977-03	2025-05-29 19:39:45.061943-03
59	11	9	2025-05-29 19:42:03.60388-03	2025-05-29 19:42:18.726496-03
61	11	16	2025-05-29 19:42:09.087793-03	2025-05-29 19:42:18.727418-03
62	11	1	2025-05-29 19:42:12.888973-03	2025-05-29 19:42:24.0785-03
58	11	6	2025-05-29 19:42:00.788831-03	2025-05-29 19:42:24.079705-03
60	11	13	2025-05-29 19:42:06.656567-03	2025-05-29 19:42:24.080811-03
66	11	9	2025-05-29 20:24:45.750196-03	2025-05-29 20:25:15.875371-03
64	11	16	2025-05-29 20:24:37.237067-03	2025-05-29 20:25:15.877745-03
63	11	1	2025-05-29 20:24:26.253177-03	2025-05-29 20:25:36.3018-03
67	11	6	2025-05-29 20:24:48.967841-03	2025-05-29 20:25:36.304026-03
65	11	13	2025-05-29 20:24:42.351904-03	2025-05-29 20:25:36.304773-03
68	11	6	2025-05-29 22:59:57.336066-03	\N
\.


--
-- Data for Name: flights; Type: TABLE DATA; Schema: public; Owner: murilo
--

COPY public.flights (id, number, origin, destination, scheduled_at, status) FROM stdin;
1	LAT1001	São Paulo	Lisboa	2025-05-29 17:11:28.52253-03	scheduled
2	GOL2002	Rio de Janeiro	Madrid	2025-05-29 18:11:28.52253-03	scheduled
3	AZU3003	Belo Horizonte	Miami	2025-05-29 19:11:28.52253-03	scheduled
4	TAP4004	Recife	Paris	2025-05-29 20:11:28.52253-03	scheduled
5	KLM5005	Fortaleza	Amsterdã	2025-05-29 21:11:28.52253-03	scheduled
6	AFR6006	Curitiba	Londres	2025-05-29 22:11:28.52253-03	scheduled
7	BAW7007	Porto Alegre	Chicago	2025-05-29 23:11:28.52253-03	scheduled
8	DLH8008	Manaus	Berlim	2025-05-30 00:11:28.52253-03	scheduled
10	AAL1010	Belém	Los Angeles	2025-05-30 02:11:28.52253-03	scheduled
9	UAL9009	Salvador	Houston	2025-05-30 01:11:28.52253-03	scheduled
11	AZU4567	GRU	RECIFE	2025-05-29 14:45:00-03	departed
\.


--
-- Data for Name: gates; Type: TABLE DATA; Schema: public; Owner: murilo
--

COPY public.gates (id, code) FROM stdin;
1	A1
2	A2
3	B1
4	B2
5	C1
6	G1
7	G2
8	G3
\.


--
-- Data for Name: resources; Type: TABLE DATA; Schema: public; Owner: murilo
--

COPY public.resources (id, code, type) FROM stdin;
1	G1	gate
2	G2	gate
3	G3	gate
4	G4	gate
5	G5	gate
6	P1	runway
7	P2	runway
8	P3	runway
9	V1	vehicle
10	V2	vehicle
11	V3	vehicle
12	V4	vehicle
13	H1	hangar
14	H2	hangar
15	H3	hangar
16	S1	service
17	S2	service
18	S3	service
19	S4	service
\.


--
-- Name: allocations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: murilo
--

SELECT pg_catalog.setval('public.allocations_id_seq', 68, true);


--
-- Name: flights_id_seq; Type: SEQUENCE SET; Schema: public; Owner: murilo
--

SELECT pg_catalog.setval('public.flights_id_seq', 11, true);


--
-- Name: gates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: murilo
--

SELECT pg_catalog.setval('public.gates_id_seq', 9, true);


--
-- Name: resources_id_seq; Type: SEQUENCE SET; Schema: public; Owner: murilo
--

SELECT pg_catalog.setval('public.resources_id_seq', 19, true);


--
-- Name: allocations allocations_pkey; Type: CONSTRAINT; Schema: public; Owner: murilo
--

ALTER TABLE ONLY public.allocations
    ADD CONSTRAINT allocations_pkey PRIMARY KEY (id);


--
-- Name: flights flights_pkey; Type: CONSTRAINT; Schema: public; Owner: murilo
--

ALTER TABLE ONLY public.flights
    ADD CONSTRAINT flights_pkey PRIMARY KEY (id);


--
-- Name: gates gates_code_key; Type: CONSTRAINT; Schema: public; Owner: murilo
--

ALTER TABLE ONLY public.gates
    ADD CONSTRAINT gates_code_key UNIQUE (code);


--
-- Name: gates gates_pkey; Type: CONSTRAINT; Schema: public; Owner: murilo
--

ALTER TABLE ONLY public.gates
    ADD CONSTRAINT gates_pkey PRIMARY KEY (id);


--
-- Name: resources resources_pkey; Type: CONSTRAINT; Schema: public; Owner: murilo
--

ALTER TABLE ONLY public.resources
    ADD CONSTRAINT resources_pkey PRIMARY KEY (id);


--
-- Name: allocations allocations_flight_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: murilo
--

ALTER TABLE ONLY public.allocations
    ADD CONSTRAINT allocations_flight_id_fkey FOREIGN KEY (flight_id) REFERENCES public.flights(id) ON DELETE CASCADE;


--
-- Name: allocations allocations_resource_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: murilo
--

ALTER TABLE ONLY public.allocations
    ADD CONSTRAINT allocations_resource_id_fkey FOREIGN KEY (resource_id) REFERENCES public.resources(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

