-- Research tools record their own usage events. Keep the event type whitelist
-- aligned with the server routes so a successful Gemini response is not turned
-- into a 500/503 while recording metrics.
alter table public.generation_events
  drop constraint if exists generation_events_type_check;

alter table public.generation_events
  add constraint generation_events_type_check
  check (type in ('sermon', 'ebd', 'xray', 'chat', 'theme-options', 'dictionary'));
