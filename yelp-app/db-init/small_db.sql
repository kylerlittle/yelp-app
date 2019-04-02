--
-- PostgreSQL database dump
--

-- Dumped from database version 10.6 (Ubuntu 10.6-0ubuntu0.18.04.1)
-- Dumped by pg_dump version 10.6 (Ubuntu 10.6-0ubuntu0.18.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- Name: day_of_week; Type: DOMAIN; Schema: public; Owner: postgres
--

CREATE DOMAIN public.day_of_week AS character varying(9)
	CONSTRAINT day_of_week_check CHECK ((((VALUE)::text = 'Sunday'::text) OR ((VALUE)::text = 'Monday'::text) OR ((VALUE)::text = 'Tuesday'::text) OR ((VALUE)::text = 'Wednesday'::text) OR ((VALUE)::text = 'Thursday'::text) OR ((VALUE)::text = 'Friday'::text) OR ((VALUE)::text = 'Saturday'::text)));


ALTER DOMAIN public.day_of_week OWNER TO postgres;

--
-- Name: hour_of_day; Type: DOMAIN; Schema: public; Owner: postgres
--

CREATE DOMAIN public.hour_of_day AS smallint
	CONSTRAINT hour_of_day_check CHECK (((VALUE >= 0) AND (VALUE <= 23)));


ALTER DOMAIN public.hour_of_day OWNER TO postgres;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: attributes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.attributes (
    business_id character(22) NOT NULL,
    attribute_name character varying(80) NOT NULL,
    attribute_value character varying(80)
);


ALTER TABLE public.attributes OWNER TO postgres;

--
-- Name: business; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.business (
    business_id character(22) NOT NULL,
    business_name character varying(100),
    business_address character varying(100),
    business_city character varying(50),
    business_state character varying(50),
    review_count integer DEFAULT 0,
    review_rating numeric(2,1) DEFAULT 0.0,
    average_stars numeric(2,1),
    num_checkins integer DEFAULT 0,
    postal_code numeric(5,0),
    is_open boolean
);


ALTER TABLE public.business OWNER TO postgres;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    business_id character(22) NOT NULL,
    category_name character varying(80) NOT NULL
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: checkin; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.checkin (
    business_id character(22) NOT NULL,
    checkin_day public.day_of_week NOT NULL,
    checkin_time public.hour_of_day NOT NULL,
    checkin_count smallint DEFAULT 0
);


ALTER TABLE public.checkin OWNER TO postgres;

--
-- Name: favorite; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.favorite (
    business_id character(22) NOT NULL,
    user_id character(22) NOT NULL
);


ALTER TABLE public.favorite OWNER TO postgres;

--
-- Name: friendswith; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.friendswith (
    owner_of_friend_list character(22) NOT NULL,
    on_friend_list character(22) NOT NULL
);


ALTER TABLE public.friendswith OWNER TO postgres;

--
-- Name: hours; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hours (
    business_id character(22) NOT NULL,
    day_open public.day_of_week NOT NULL,
    opens_at public.hour_of_day NOT NULL,
    closes_at public.hour_of_day NOT NULL
);


ALTER TABLE public.hours OWNER TO postgres;

--
-- Name: review; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.review (
    user_id character(22) NOT NULL,
    business_id character(22) NOT NULL,
    review_id character(22) NOT NULL,
    cool integer DEFAULT 0,
    funny integer DEFAULT 0,
    useful integer DEFAULT 0,
    stars_given numeric(1,0) DEFAULT 0,
    date_written date,
    review_text text
);


ALTER TABLE public.review OWNER TO postgres;

--
-- Name: yelpuser; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.yelpuser (
    user_id character(22) NOT NULL,
    average_stars numeric(3,2),
    cool integer DEFAULT 0,
    fans integer DEFAULT 0,
    funny integer DEFAULT 0,
    user_name character varying(60),
    useful integer DEFAULT 0,
    yelping_since date,
    review_count integer DEFAULT 0
);


ALTER TABLE public.yelpuser OWNER TO postgres;

--
-- Data for Name: attributes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.attributes (business_id, attribute_name, attribute_value) FROM stdin;
\.


--
-- Data for Name: business; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.business (business_id, business_name, business_address, business_city, business_state, review_count, review_rating, average_stars, num_checkins, postal_code, is_open) FROM stdin;
1                     	Shellys Dental	400 S.E. Street	Denali	WA	0	0.0	\N	0	99201	t
2                     	Mattress Farm	1659 Helman Drive	Schwal	WA	0	0.0	\N	0	98260	t
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (business_id, category_name) FROM stdin;
1                     	dentist
2                     	mattress
\.


--
-- Data for Name: checkin; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.checkin (business_id, checkin_day, checkin_time, checkin_count) FROM stdin;
1                     	Tuesday	15	1
2                     	Friday	10	2
\.


--
-- Data for Name: favorite; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.favorite (business_id, user_id) FROM stdin;
\.


--
-- Data for Name: friendswith; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.friendswith (owner_of_friend_list, on_friend_list) FROM stdin;
1                     	2                     
\.


--
-- Data for Name: hours; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hours (business_id, day_open, opens_at, closes_at) FROM stdin;
1                     	Tuesday	9	17
1                     	Monday	9	17
1                     	Wednesday	9	17
1                     	Thursday	9	17
1                     	Friday	9	17
2                     	Friday	9	17
2                     	Thursday	9	17
2                     	Wednesday	9	17
2                     	Monday	9	17
2                     	Tuesday	9	17
\.


--
-- Data for Name: review; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.review (user_id, business_id, review_id, cool, funny, useful, stars_given, date_written, review_text) FROM stdin;
1                     	1                     	1                     	1	1	0	5	2010-12-20	Stopped in here for my first teeth cleaning after moving before heading home for the holidays. They were excellent at helping me figure out how to get my records transfered, and their holiday hours were awesome. Also, Dr. Shelley, DDS, has a friendly and personable chairside manner.
2                     	1                     	2                     	0	0	1	3	2016-05-24	These guys are the worst. My appointment was 50 minutes. Thank goodness I had a free afternoon. I am now looking for a new dentist.
1                     	2                     	3                     	0	0	0	5	2011-04-20	Great service when the professionals at Mattress Farm delivered my mattress and even hauled my old one away!
\.


--
-- Data for Name: yelpuser; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.yelpuser (user_id, average_stars, cool, fans, funny, user_name, useful, yelping_since, review_count) FROM stdin;
1                     	\N	1	0	1	Carly	0	2009-10-03	0
2                     	\N	0	0	1	Thomas	1	2016-03-30	0
\.


--
-- Name: attributes attributes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attributes
    ADD CONSTRAINT attributes_pkey PRIMARY KEY (attribute_name, business_id);


--
-- Name: business business_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.business
    ADD CONSTRAINT business_pkey PRIMARY KEY (business_id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (category_name, business_id);


--
-- Name: checkin checkin_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.checkin
    ADD CONSTRAINT checkin_pkey PRIMARY KEY (business_id, checkin_day, checkin_time);


--
-- Name: favorite favorite_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorite
    ADD CONSTRAINT favorite_pkey PRIMARY KEY (business_id, user_id);


--
-- Name: friendswith friendswith_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.friendswith
    ADD CONSTRAINT friendswith_pkey PRIMARY KEY (owner_of_friend_list, on_friend_list);


--
-- Name: hours hours_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hours
    ADD CONSTRAINT hours_pkey PRIMARY KEY (day_open, business_id);


--
-- Name: review review_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT review_pkey PRIMARY KEY (review_id);


--
-- Name: yelpuser yelpuser_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.yelpuser
    ADD CONSTRAINT yelpuser_pkey PRIMARY KEY (user_id);


--
-- Name: attributes attributes_business_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attributes
    ADD CONSTRAINT attributes_business_id_fkey FOREIGN KEY (business_id) REFERENCES public.business(business_id);


--
-- Name: categories categories_business_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_business_id_fkey FOREIGN KEY (business_id) REFERENCES public.business(business_id);


--
-- Name: checkin checkin_business_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.checkin
    ADD CONSTRAINT checkin_business_id_fkey FOREIGN KEY (business_id) REFERENCES public.business(business_id);


--
-- Name: favorite favorite_business_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorite
    ADD CONSTRAINT favorite_business_id_fkey FOREIGN KEY (business_id) REFERENCES public.business(business_id);


--
-- Name: favorite favorite_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorite
    ADD CONSTRAINT favorite_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.yelpuser(user_id);


--
-- Name: friendswith friendswith_on_friend_list_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.friendswith
    ADD CONSTRAINT friendswith_on_friend_list_fkey FOREIGN KEY (on_friend_list) REFERENCES public.yelpuser(user_id);


--
-- Name: friendswith friendswith_owner_of_friend_list_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.friendswith
    ADD CONSTRAINT friendswith_owner_of_friend_list_fkey FOREIGN KEY (owner_of_friend_list) REFERENCES public.yelpuser(user_id);


--
-- Name: hours hours_business_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hours
    ADD CONSTRAINT hours_business_id_fkey FOREIGN KEY (business_id) REFERENCES public.business(business_id);


--
-- Name: review review_business_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT review_business_id_fkey FOREIGN KEY (business_id) REFERENCES public.business(business_id);


--
-- Name: review review_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT review_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.yelpuser(user_id);


--
-- PostgreSQL database dump complete
--

