import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Hero } from './hero';
//import { HEROES } from './mock-heroes';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})

export class HeroService {

	private heroesUrl = 'api/heroes';

	private httpOptions = {
		headers: new HttpHeaders({ 'Content-Type': 'application/json' })
	};

	constructor(private http: HttpClient, private messageService: MessageService) { }

	getHeroes(): Observable<Hero[]> {
		// const heroes = of(HEROES);
		// this.messageService.add('HeroService: fetched heroes');
		// return heroes;

		return this.http.get<Hero[]>(this.heroesUrl)
			.pipe(
				tap(_ => this.log('fetched heroes')),
				catchError(this.handleError<Hero[]>('getHeroes', []))
			);
	}

	getHero(id: number): Observable<Hero> {
		// const hero = HEROES.find(h => h.id === id)!;
		// this.messageService.add(`HeroService: fetched hero id=${id}`);
		// return of(hero);

		return this.http.get<Hero>(`${this.heroesUrl}/${id}`)
			.pipe(
				tap(_ => this.log(`fetched hero id=${id}`)),
				catchError(this.handleError<Hero>(`getHero id=${id}`))
			);
	}

	updateHero(hero: Hero): Observable<any> {
		return this.http.put(this.heroesUrl, hero, this.httpOptions)
			.pipe(
				tap(_ => this.log(`updated hero id=${hero.id}`)),
				catchError(this.handleError<any>('updateHero'))
			);
	}

	addHero(hero: Hero): Observable<Hero> {
		return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions)
			.pipe(
				tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
				catchError(this.handleError<Hero>('addHero'))
			);
	}

	deleteHero(id: number): Observable<Hero> {
		const url = `${this.heroesUrl}/${id}`;

		return this.http.delete<Hero>(url, this.httpOptions)
			.pipe(
				tap(_ => this.log(`deleted hero id=${id}`)),
				catchError(this.handleError<Hero>('deleteHero'))
			);
	}


	searchHeroes(term: string): Observable<Hero[]> {
		if (!term.trim()) {
			return of([]);
		}
		return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`)
			.pipe(
				tap(x => x.length ?
					this.log(`found heroes matching "${term}"`) :
					this.log(`no heroes matching "${term}"`)),
				catchError(this.handleError<Hero[]>('searchHeroes', []))
			);
	}

	private log(message: string) {
		this.messageService.add(`HeroService: ${message}`);
	}

	private handleError<T>(operation: string, result?: T) {
		return (error: any): Observable<T> => {
			console.error(error);
			this.log(`${operation} failed: ${error.message}`);
			return of(result as T);
		};
	}
}

