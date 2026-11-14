import { httpResource } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Activity } from '../../core/models/activity.model';

const FEED_SIZE = 15;

@Injectable()
export class ActivityFeedService {
  readonly activities = httpResource<Activity[]>(
    () => `/api/activities?_sort=createdAt&_order=desc&_limit=${FEED_SIZE}`,
  );
}
