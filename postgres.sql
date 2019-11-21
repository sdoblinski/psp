--
-- PostgreSQL database dump
--

-- Dumped from database version 11.3 (Ubuntu 11.3-1.pgdg18.04+1)
-- Dumped by pg_dump version 11.3 (Ubuntu 11.3-1.pgdg18.04+1)

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
-- Name: playable_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.playable_status AS ENUM (
    'paid',
    'waiting_funds'
);


ALTER TYPE public.playable_status OWNER TO postgres;

--
-- Name: transaction_payment_method; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.transaction_payment_method AS ENUM (
    'debit_card',
    'credit_card'
);


ALTER TYPE public.transaction_payment_method OWNER TO postgres;

--
-- Name: transaction_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.transaction_status AS ENUM (
    'paid',
    'waiting_funds'
);


ALTER TYPE public.transaction_status OWNER TO postgres;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: playables; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.playables (
    id integer NOT NULL,
    status public.playable_status,
    payment_date timestamp with time zone,
    value numeric(10,2),
    client_id character varying(30),
    "createdAt" timestamp with time zone DEFAULT now(),
    "updatedAt" timestamp with time zone DEFAULT now()
);


ALTER TABLE public.playables OWNER TO postgres;

--
-- Name: transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transactions (
    id integer NOT NULL,
    value numeric(10,2),
    description character varying(50),
    payment_method public.transaction_payment_method,
    card_number character varying(4),
    card_name character varying(30),
    card_expiration_date character varying(6),
    card_ccv character varying(3),
    client_id character varying(30),
    "createdAt" timestamp with time zone DEFAULT now(),
    "updatedAt" timestamp with time zone DEFAULT now()
);


ALTER TABLE public.transactions OWNER TO postgres;

--
-- Name: transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.transactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.transactions_id_seq OWNER TO postgres;

--
-- Name: transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.transactions_id_seq OWNED BY public.transactions.id;


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.playables.id;


--
-- Name: playables id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.playables ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: transactions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions ALTER COLUMN id SET DEFAULT nextval('public.transactions_id_seq'::regclass);


--
-- Name: transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.transactions_id_seq', 107, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 89, true);


--
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);


--
-- Name: playables users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.playables
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: playables_client_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX playables_client_id_idx ON public.playables USING btree (client_id);


--
-- Name: transactions_client_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX transactions_client_id_idx ON public.transactions USING btree (client_id);


--
-- PostgreSQL database dump complete
--