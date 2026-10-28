create policy insert_own_events on public.generation_events for insert to authenticated with check(user_id=(select auth.uid()));
grant insert on public.generation_events to authenticated;
