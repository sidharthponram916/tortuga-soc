import cron from "node-cron";

const amazonJobUpdates = async () => {
  try {
    const res = await fetch(
      "https://www.amazon.jobs/en/search.json?normalized_country_code%5B%5D=USA&radius=24km&facets%5B%5D=normalized_country_code&facets%5B%5D=normalized_state_name&facets%5B%5D=normalized_city_name&facets%5B%5D=location&facets%5B%5D=business_category&facets%5B%5D=category&facets%5B%5D=schedule_type_id&facets%5B%5D=employee_class&facets%5B%5D=normalized_location&facets%5B%5D=job_function_id&facets%5B%5D=is_manager&facets%5B%5D=is_intern&offset=0&result_limit=10&sort=relevant&latitude=&longitude=&loc_group_id=&loc_query=&base_query=Intern&city=&country=&region=&county=&query_options=&"
    );

    const data = await res.json();

    for (let job of data.jobs) {
      console.log(job.title);
      console.log(job.location);
      console.log("------------------------");
    }
  } catch (e) {
    return;
  }
};

export default amazonJobUpdates;
