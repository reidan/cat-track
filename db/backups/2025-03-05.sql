PGDMP  ,                    }            dkr_cat_track    16.6 (Debian 16.6-1.pgdg120+1)    16.3 *    E           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            F           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            G           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            H           1262    16389    dkr_cat_track    DATABASE     x   CREATE DATABASE dkr_cat_track WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.UTF8';
    DROP DATABASE dkr_cat_track;
                dkr_cat_track_user    false            I           0    0    dkr_cat_track    DATABASE PROPERTIES     6   ALTER DATABASE dkr_cat_track SET "TimeZone" TO 'utc';
                     dkr_cat_track_user    false                        2615    2200    public    SCHEMA     2   -- *not* creating schema, since initdb creates it
 2   -- *not* dropping schema, since initdb creates it
                dkr_cat_track_user    false            �            1259    16399    cats    TABLE     �   CREATE TABLE public.cats (
    id integer NOT NULL,
    name text NOT NULL,
    birthday date NOT NULL,
    calorie_goal integer DEFAULT 0,
    photo text
);
    DROP TABLE public.cats;
       public         heap    dkr_cat_track_user    false    5            �            1259    16398    cats_id_seq    SEQUENCE     �   CREATE SEQUENCE public.cats_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 "   DROP SEQUENCE public.cats_id_seq;
       public          dkr_cat_track_user    false    216    5            J           0    0    cats_id_seq    SEQUENCE OWNED BY     ;   ALTER SEQUENCE public.cats_id_seq OWNED BY public.cats.id;
          public          dkr_cat_track_user    false    215            �            1259    16418 	   food_logs    TABLE     �   CREATE TABLE public.food_logs (
    id integer NOT NULL,
    cat_id integer,
    food_id integer,
    "timestamp" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    quantity numeric NOT NULL,
    calories numeric NOT NULL
);
    DROP TABLE public.food_logs;
       public         heap    dkr_cat_track_user    false    5            �            1259    16417    food_logs_id_seq    SEQUENCE     �   CREATE SEQUENCE public.food_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.food_logs_id_seq;
       public          dkr_cat_track_user    false    5    220            K           0    0    food_logs_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.food_logs_id_seq OWNED BY public.food_logs.id;
          public          dkr_cat_track_user    false    219            �            1259    16409    foods    TABLE     �   CREATE TABLE public.foods (
    id integer NOT NULL,
    name text NOT NULL,
    unit text NOT NULL,
    calories_per_unit numeric NOT NULL,
    favorite boolean DEFAULT false
);
    DROP TABLE public.foods;
       public         heap    dkr_cat_track_user    false    5            �            1259    16408    foods_id_seq    SEQUENCE     �   CREATE SEQUENCE public.foods_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.foods_id_seq;
       public          dkr_cat_track_user    false    5    218            L           0    0    foods_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.foods_id_seq OWNED BY public.foods.id;
          public          dkr_cat_track_user    false    217            �            1259    16445    users    TABLE     �   CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    password text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);
    DROP TABLE public.users;
       public         heap    dkr_cat_track_user    false    5            �            1259    16444    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public          dkr_cat_track_user    false    222    5            M           0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public          dkr_cat_track_user    false    221            �           2604    16402    cats id    DEFAULT     b   ALTER TABLE ONLY public.cats ALTER COLUMN id SET DEFAULT nextval('public.cats_id_seq'::regclass);
 6   ALTER TABLE public.cats ALTER COLUMN id DROP DEFAULT;
       public          dkr_cat_track_user    false    215    216    216            �           2604    16421    food_logs id    DEFAULT     l   ALTER TABLE ONLY public.food_logs ALTER COLUMN id SET DEFAULT nextval('public.food_logs_id_seq'::regclass);
 ;   ALTER TABLE public.food_logs ALTER COLUMN id DROP DEFAULT;
       public          dkr_cat_track_user    false    219    220    220            �           2604    16412    foods id    DEFAULT     d   ALTER TABLE ONLY public.foods ALTER COLUMN id SET DEFAULT nextval('public.foods_id_seq'::regclass);
 7   ALTER TABLE public.foods ALTER COLUMN id DROP DEFAULT;
       public          dkr_cat_track_user    false    218    217    218            �           2604    16448    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public          dkr_cat_track_user    false    221    222    222            <          0    16399    cats 
   TABLE DATA           G   COPY public.cats (id, name, birthday, calorie_goal, photo) FROM stdin;
    public          dkr_cat_track_user    false    216   ^-       @          0    16418 	   food_logs 
   TABLE DATA           Y   COPY public.food_logs (id, cat_id, food_id, "timestamp", quantity, calories) FROM stdin;
    public          dkr_cat_track_user    false    220   �-       >          0    16409    foods 
   TABLE DATA           L   COPY public.foods (id, name, unit, calories_per_unit, favorite) FROM stdin;
    public          dkr_cat_track_user    false    218   �K       B          0    16445    users 
   TABLE DATA           C   COPY public.users (id, username, password, created_at) FROM stdin;
    public          dkr_cat_track_user    false    222   �M       N           0    0    cats_id_seq    SEQUENCE SET     9   SELECT pg_catalog.setval('public.cats_id_seq', 3, true);
          public          dkr_cat_track_user    false    215            O           0    0    food_logs_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.food_logs_id_seq', 559, true);
          public          dkr_cat_track_user    false    219            P           0    0    foods_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.foods_id_seq', 30, true);
          public          dkr_cat_track_user    false    217            Q           0    0    users_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.users_id_seq', 1, false);
          public          dkr_cat_track_user    false    221            �           2606    16407    cats cats_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY public.cats
    ADD CONSTRAINT cats_pkey PRIMARY KEY (id);
 8   ALTER TABLE ONLY public.cats DROP CONSTRAINT cats_pkey;
       public            dkr_cat_track_user    false    216            �           2606    16426    food_logs food_logs_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.food_logs
    ADD CONSTRAINT food_logs_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.food_logs DROP CONSTRAINT food_logs_pkey;
       public            dkr_cat_track_user    false    220            �           2606    16416    foods foods_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.foods
    ADD CONSTRAINT foods_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.foods DROP CONSTRAINT foods_pkey;
       public            dkr_cat_track_user    false    218            �           2606    16457    foods unique_food_name 
   CONSTRAINT     Q   ALTER TABLE ONLY public.foods
    ADD CONSTRAINT unique_food_name UNIQUE (name);
 @   ALTER TABLE ONLY public.foods DROP CONSTRAINT unique_food_name;
       public            dkr_cat_track_user    false    218            �           2606    16453    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            dkr_cat_track_user    false    222            �           2606    16455    users users_username_key 
   CONSTRAINT     W   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);
 B   ALTER TABLE ONLY public.users DROP CONSTRAINT users_username_key;
       public            dkr_cat_track_user    false    222            �           2606    16427    food_logs food_logs_cat_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.food_logs
    ADD CONSTRAINT food_logs_cat_id_fkey FOREIGN KEY (cat_id) REFERENCES public.cats(id) ON DELETE CASCADE;
 I   ALTER TABLE ONLY public.food_logs DROP CONSTRAINT food_logs_cat_id_fkey;
       public          dkr_cat_track_user    false    3231    216    220            �           2606    16432     food_logs food_logs_food_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.food_logs
    ADD CONSTRAINT food_logs_food_id_fkey FOREIGN KEY (food_id) REFERENCES public.foods(id) ON DELETE CASCADE;
 J   ALTER TABLE ONLY public.food_logs DROP CONSTRAINT food_logs_food_id_fkey;
       public          dkr_cat_track_user    false    220    218    3233                       826    16391     DEFAULT PRIVILEGES FOR SEQUENCES    DEFAULT ACL     Y   ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON SEQUENCES TO dkr_cat_track_user;
                   postgres    false                       826    16393    DEFAULT PRIVILEGES FOR TYPES    DEFAULT ACL     U   ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON TYPES TO dkr_cat_track_user;
                   postgres    false                       826    16392     DEFAULT PRIVILEGES FOR FUNCTIONS    DEFAULT ACL     Y   ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON FUNCTIONS TO dkr_cat_track_user;
                   postgres    false                       826    16390    DEFAULT PRIVILEGES FOR TABLES    DEFAULT ACL     V   ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON TABLES TO dkr_cat_track_user;
                   postgres    false            <   N   x�3����U�HL��4202�50�54�4�0���2��/N�JX��p�$�9���A@� 9N#s�D� Q�      @      x�}|I�$)����*j��CM����:ޑ�=���,Sx�ڣh���pa�_����_��J����Z;��Wʏ����������Ԧ���G7'e����./��B�J�i���Vzq����T��b����^�~!����~j�n��Z=iU�m�짿x��2U�G�m��}J��T�#N/?D�V�K�J��O�&o2y	�B;�*un�_���?~�˭�˰W��	߄����:p�L��?��وu���
Zm?i�p�)����-���wr����P�c����MǾ�?�7۔�Oy�f/�<v����x*&~Q�K/q=�/�`8/���]�'��W�m�;��~Yf`Y|����.������P'�����wR0�HH�������T��X6�1$�����NJ��e!�c���%ë�W�y�y�
���K�nM7�x��ې����/:¡ǔ�����r�������u�˰��]/Z)�!�h��ݴ��%���]�-�$m��!.���*�ɷe��}*�|����0\��������!���ߘ�?8i��C:q��Z�3���L�ð��f/�y7���;��F��$}�������n�6���E�c����0}ڝi�c�A�Ϋ]�kr���z(�%�����W��i]�J��1�[����w��J��2|XUw������W��yP�?^��k����.�P_V~�+c�Wu��I���!ֱ�v����m�m��V��+��y�IoLht|�B�����Ä������g@w��]A�g�bޅ�t�%��4��<pU��f[��V:��j#b�/�\�ñ�ic�]`���5��M�P���7�h�b��=���"�֓��D�W�s3��O6iۿ�P���w���Pa�\`J:���
o'5�]���]9v��A3wݸ�M�*ŗq<Ax ����P�`
CG;4��z�o����� ��|��,+�c�  �M��������B5�F�U�.|�%X;���_J������"�v���5i���� ���᠝ը�+{$W}�~�� 8�=�ٷ�hF�t�>@K�Ǟ
~�~�yqk�uȂ?����A���c�h�7����<=T���Bq��<��_|h	܋���HL�,.ǽw�FȊā���T�@�0%��)���4w�TU�ﱭ�?�qJhY�i9�S���~��"�l3� ��ë��ny7�/�ϵj�=(��GD4�
�X�a�Z��<6 �߹�G>�\�[�����1"�K�����H��5��ߨ�!\!�]r{�Ħ�2�<i�¨;�.r�M��-?����<����l�D�VVV�pw=8�-�QƠ����-���'�������1V]R�2"�G�ƣX�jd�)B���[o3B⋈f�SĠ�<z���@l�v��6��QG��=L ��{*�Y��}Qm�w(>dQO�������%�i��5b�
oe�1�A���<���}�����3�)�%�d��bg�l�
���AH��ܓ����^��D��Hk%l��)�'Zf���gZ�ˊ�B�3������Nޭ1/P�Kܸ@��C?�fV��؁hW�{)�SMK>	ѷ���fP�%
R��K�<�^���[p"�+Z��2�S�v9R��J��l�ك�t&��e�n,�@��4�֥P�hd�@�\�L�&�p�G��/��ԑ�yW�{�*n���r��C�f����Z+���9�{.m^C�H��{�}�#�� �\~�7��I���a_zY�ibe�d��^.B/;~�#�]q(r�v' <�vG[P)�&A��	�h�f픢JX��0U��N�u����PQ�#�r��X����Ӯ;C�r��ٹ��� t�P����9䆤خiB�Q@>�:�n�8K=�5��Ը�������o�W���FM��wH����Gx��&"�0Q�~��g#3b��T�w����͋��Z��� �Ue�ϲo�2#	�#�i�,ߒ���˗)8G�(��|p,`ƚ�J��N53}�{qbИ��hͼ�XI��]�w�CH�8�e-J�4���&����Jhk�>-A�(�>l.�X�ny�ǏoI�\KQ�]F� !{�W���R��p7��C`)�%hҶI.����, �uI�����J"+wj���-���|��4���R&Yt�����)P���X��k���,�xU�w�*d�`d��"vcRf]se�{-x�sx�:WYu}�[������e��к�㻧�Ď����ݭ*�2�F��n�xv�������Ǒ�q�/�V��R Ӧ�~\�Zw=����H�ς����u4��2�}���}DM�>�B�+�{ވ��Wc� ��޲.O���U��ܑ��*>O^
-�YBU�n���;���/?��z����j�	[>�Sj��I�9��Zf5Nv���&}4rb��Q�d(��:l��qI�2j	̊GW���&����2����(�C]��8X�q��TBx�QD���>0���*����I��T_�'���x�:�q�`�HXL���r@Dk�͏+�o�[tT�oÐ#�T��˒���o���h���\u9+r}'����d���ͱM��'5�2\�U��N��c#A�e^D���Fڡ7� ����F���#���Y�P��,�I�V��@����5LP��m�ߏ�A|PV.�~D��1�^�0r��轕k��� 0�.��q��.�0�6���މ��Mi\�#M�&ϥ��׫�G��)R_�Q�H����*X�"��Y�h�4>����w���.4�g5�o?�@����Z6���G���� .&���#0��)'y�� ����v�f�I��Wo2	PI���ܙ����W�U�L�q0i����U�}�����Ϊ�'�e������	����4|���?��G<��s��S�cJ���wK.�n�d�3��
�ֵ^��
0��G��xV�N�A��X�ia9LJ���xz���5���u�d�"���<�\��J�+�9��ɛ�F��>�.�t_�}� ����zM����^�&�����RI�5�$���1s�>-�!iN�����@�n�S)�nސ(�1� of��S9��z��Z ЊT}y.��*^�&�&9,��xV���[5���lW!i�kT1b�R2K�z�Z�9�Hh$�]4�{�\ܬ2�/�����s�y����;�����gw�Ҷ~�gmx�����~|�Xfइk.��'J��:�\yۓ(�~|]�/���:�����I�Y���њ�a=dj	��^叮%��-�`$���Y{�p줇���z:�\G����g� �b%�!WK��x��6I�^�	�\�8;��j�8ն�,���_L��Y����q��=R�ʶ��� �Hm�������k�$B(���tgR�7�P��[N3n�\�IW�I�1�儘��P&b����rU������4?M��>����o0�����8}��:��O�L���#�I ��Z*�ϵQ���/SU�ې����>s���7���䚙�<��O���_n��׏m�x��G���k" �kh�z�-�muuM� �����bl� [� �3/Pev�|̩($��l�k��#Z,>���k#��Q�c�K%f�t�5���thq�5$�{�`���x����d�Ec�W��K���m(�kR�k[PD^����X�;���t�7�J/�Y5�+��|�ʳ�s�����ԧ�T/̋�޹��5��Z�H4���in�Qڳ'6�k_��Wrie���-�r��~ A�_Lz����.P��T��x�b�}���� ܶs��õ
�
��v��!�ޘ����p��;�ť��������"ZhY��~�a?���j��1Z�7c8��k�xs�,�z��;�=�8o���x�� �}�j��������^�����<��zGmf_iX�hV���>(Q���ѐ�ՅF?��Fr>��pZ��P�E�u�F���4�z��/�"A��J� �q��$�Dԧf��|X���G4�̂FF�$rx�%$t�Nx��%7��j�v�{�[���Ѹ�-��.�@G��%�J^_����&�nJ   qv�����WFI��kA�*�Z��X��q0�b��������$)'�!��(_h���z�8�!�t��.���~2�������z:
�H��v�?���Sk�P��})�O�a`Ϊ���0	Ǟ;��O�u�ɧ��H*���P�$�
7�����w�����Ճ��Ky7�ڇX̧M5�Jތ��|!�%�y2,��Q;�nK}>�%�y?59ZR���jҺ&K�s]_��?ik��#i�f}9J~M��?�sN�R^��Ϋ�'Tc�>?p��;�d�
�qnRJ
4S�j������Y	�㷪�|
����
����abJ�����K��p��5>�9^4���i-���w��F�1g���g�3׎9W���I��Kq�i9����'}cX����i�>+僯�ޯ��j>D�h;.������@~h/G���}慥��'� �40*�k�?z#ύE���3
����W�%�\���X�r���R��ZP�xX�換�#[9*2k�v�}���(U�x21�Ҭ�ɗ�^�W�gO�-�s�O(���|�=a���$�b�p��|T� Ic����1����.���i�e�6�QE�oHm���{�ʺ�I�6-� �t���w��Z�� ��T\)�p�z=!�}�W��"��#$'�8� IW '�L�� �:�#K�E�^ѡ�ئ�l1>��ڈrP�-H�Ƞ.ǉ眮�"D6��ױ�/i�b�Z�g�t�K�	���S�)����t�pQs܄��	8�i��W�R�V��)�#͞sw`E͛	�Ӯ=�p֘���p�yY�	���'��<Ҽ�g-L���Խ�6��TG��+����m]Z$[>�����It���ۖ��*I�Z�]]/��n�փa~��3t(Ẑ�mu����f�%�6��;�~	U�]Z�!���Ά�� Q���ň�חK�+���³���!���{���!�y�?�H��q�"�(����rvi�Aa�>0_<m�߬�n���g�F���ϛV���k͛;}��>�nyk\b�[r)i��8>_�ea�[n��*�I�_��x�����~�ֳX|m���F�w��I�em��l/���i'�Z�-K��KrG`��A��Qg��~��(}/o�R��7����#M-n�ӍK���J��/I�֦���@���Ġ�S<�)���U�e؍o\��9�	\����c]�h�Z�:� kc��(�ރ������<<��#� A��[����'�q�$�b C��&K��v��ŔL��/w�e�;k�?r�fNyPB�Г�z2��	�S]R���}z�����~�;J��J¿,nY,u#Ղ!���#�=l�;:�5f�ЩQ�\&�{�k����8�{�kk�a�b�λ�� �|�ZM~�	Z(|.�?3i�Jˡ��^b4��K��XR���h�����=D0�� ѫ���=H��\q����&�j��Yq���=.)i]�;<;�
�<��I�٢���\�Ғ��\�.X�����552��Lk:�U%:xVW&�L��t�IgA��q��;<�l=�y��zp!�/\ ���Lиw$�|����j��K�,���i�;�����4^/��P���A��2O6�B��|A���!k}M���V�<�W�OO���z�,-z��[4=�b.]�p90�5?�x�FR�T�C-m��OYDY���Qjw)l��%o�K��5�(��f�2�:yd\6��� \�3��Z���~���yK�=90g��/��a�񮎩��E��R�֦ɩ���>�O�^`��[�:eN1�A�`�p�OY�ۖ�6����Y�6|T����y���sA���M\�^n{�Wsy�z��(A���iDR��6�蕮5v��߾N��A�C�n�v�?*Zȸ�4�����:5?m�Mt]:kMǮ%����8�{%U�aG��oe!��O����N�Z+��u�lM���|h���x>�v�r����Z5�Wp,)+Q=��QN���NsAq�x_����U��:�0l:�^~"�u�H�9�䞼�����Ʌ�~Ax���,�ƫ�\կ̥��^4M���9��Ɲ6�[3Z�
�S��\���}1��׻� ���Z�N�>�a�Ɠ�B<�Q ��9x7������7.��g�D�<�[R^>����|ʵx�!\��Jm����OY����>$:_)D����M/K9}�2�V"w�{?�ݖj���SI5�o�~�T}��oܠ��%Y2_����=�c6�~��*��Y!�NJ��������m�.�����<���P�� ��ˊ�wJ���l;"ڗR��>⤵g&��v�踺�߂})	�N�~���5��9��F_52~MG�YZ��^e��߮���6>��W��vV�<%����m�C5��8~`oQ?�B� �i7�Vo���S��t�������>���lF�3k���އ�|:����͗گ����lf+mH�����|luKiv��9���,_>/�ܾ����l��oFR�f��A �C��J��H'�?�"T�y����z�9��0�Ԭ�]d��=E�}N����L�M�.
Xb�[���D�.=��[A"�}�Fc��G��%:4��c?n����:gj[���Pt��"��=�-���M���I��ٷ3� Y�\�!y��v�{��_�����n�1��}��/��}�e^V�7�� @��R�y�1uv�:}�="?������ޙ}�u������5�����=��2H�@v�N�x���HB��={s�ǃMJd�Ν�m-)���g��4�.6���3��,�AO�ҿ�[�E�fs��eI���jM,g�����?���&���-���nw�k9�e�שd�F���kc����v�̞�͇�L�/��S���u��G���R��kV�+�0e}�~Tب�<����[�?�hF��&}(q����@������'ȧp"oX� W�� �X��p��c��@�藔�f|f��Ϻӛ���tm���q��E����q33�K�澢k0V��>P�Y	��3�֑�ym��-[J�bޯ�K��+��qʸdz�z�� 3]o>=����b<��Vy��XL��N�=�FR���v?����;V`�z������Ki�_�5N.h���v1���P�sO�vڬgp�~��?#��ђA_�!�5��8����Z�WZ$��z�/�a��n<`���>ޢ�K�K���B�;�����q�b��B����;e&����.�[�����z�;޼0�0��2���fb'K櫘p⣬�4;�LK���ZD���/G'�|�MOu�3��>	��d��/
�;8OU�}�N�q�������S?�ҟ{^���t�6(���y3����~��m��>Yw`D0wI/ۛ�C�s������	&Zbz�Y��Vr�?n�#m�yz/�!����OA�ZV��^da��kb��PX_[g���7��8�� E���4�GR�%�)�����/ϒS?�)ۀg��� ���.z������X��I��Ľ�l��_۪H7��|�o5`n#���� �:�Ρ�Y�n���nz���������_�����u      >   �  x�m��n�0�����aC��mVi/*m�Fۛ�q�t���1����1�Ĩ����̙��Ǟ=�y:)����Z���(��;H���ʟ�i�n�Da���K��'��p$�gݛj����
xLJ_�4�#��Lvg��TY��=�f��q�5^�Q�L��X+$p�b/Z^�+X�;�Gpq�WSW_}<�r�s���0�f���ݓNΌy�-lH=]��>iF�s��Y�K/Z"$���Ύ��e),�v�Z1�#���F����+�ݼ�m{�]�v4��b��]=tDݿ���-�\�ԣ�S�'��l�ݬ�ۈ�����Ɏ�����|�ƚn��U���深*6��MF�E��eW�r�	�9�޽������2�i���ƾA6VZ���03�[���n��n!�׾�V�����N��9�P�� �
r      B      x������ � �     