-- Editor Ministerial: estudos persistentes com blocos, referências e contexto privados.
-- Estudos existentes não são alterados; apenas o tipo permitido é ampliado.
alter table public.studies drop constraint if exists studies_type_check;
alter table public.studies add constraint studies_type_check check(type in ('sermon','ebd','xray','editor'));
